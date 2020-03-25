import Post from '../../models/post';
import mongoose from 'mongoose';
import Joi from 'joi';

/*미들웨어 생성*/
const {ObjectId} = mongoose.Types;

export const getPostById = async (ctx, next)=>{
    const {id} = ctx.params;
    if(!ObjectId.isValid(id)){
        ctx.status = 400; // Bad Request
        return;
    }
    try{
        const post = await Post.findById(id);
        // 포스트가 존재하지 않을 때
        if(!post){
            ctx.status = 404; // Not Found
            return ;
        }
        ctx.state.post = post;
        return next();
    }catch (e) {
        ctx.throw(500,e);
    }

};

// 포스트가 사용자가 작성한 포스트 인지 확인
export const checkOwnPost = (ctx, next) =>{
    const { user, post } = ctx.state;
    if(post.user._id.toString() !== user._id){
        ctx.status = 403;
        return;
    }
    return next();
};

/*
* POST /api/posts
* {
*   title : '제목',
*   body : '내용',
*   tags : ['태그1','태그2']
* }
* */
export const write = async ctx => {

    const schema = Joi.object().keys({
        // 객체가 다음 필드를 가지고 있음을 검증
        title : Joi.string().required(),  //required()가 있으면 필수 항목
        body : Joi.string().required(),
        tags : Joi.array()
            .items(Joi.string())
            .required(),   // 문자열로 이루어진 배열
    })

    // 검증하고 나서 검증 실패인 경우 에러 처리
    const result = Joi.validate(ctx.request.body, schema);
    if(result.error){
        ctx.status = 400; // Bad request
        ctx.body = result.error;
        return;
    }

    const {title, body, tags} = ctx.request.body;
    const post = new Post({
        title,
        body,
        tags,
        user : ctx.state.user,
    });
    try {
        await post.save();
        ctx.body = post;
    } catch (e) {
        ctx.throw(500,e);
    }
};

/*
*  GET /api/posts?username=&tag=&page=
* */
export const list = async ctx => {
    // query는 문자열이기 때문에 숫자로 변환 해주어야함
    // 값이 주어지지 않았다면 1을 기본값으로 사용
    const page = parseInt(ctx.query.page || '1',10);

    if(page<1){
        ctx.status = 400;
        return;
    }

    const {tag, username} = ctx.query;
    // tag, username 값이 유효하면 객체 안에 넣고, 그렇지 않으면 넣지않음
    const query = {
        ...(username? {'user.username':username}:{}),
        ...(tag? {tags:tag}:{}),
    };

    try{
        const posts =await Post.find(query)
            .sort({_id:-1}) // 역순
            .limit(10)      // 개수제한
            .skip((page - 1)*10)      // 페이지 스킵
            .lean() // lean함수를 사용해 조회 -> json형태로 조회 함
            .exec();
        const postCount = await Post.countDocuments(query).exec(); // 총 갯수
        ctx.set('Last-Page', Math.ceil(postCount / 10)); // Last-Page라는 커스텀 HTTP 헤더를 설정
        ctx.body = posts.map(post => ({
                ...post,
                body :
                    post.body.length <200? post.body : `${post.body.slice(0,200)}...`,
            }));
    }catch (e) {
        ctx.throw(500,e)
    }
};

/*
*  GET /api/posts/:id
* */
export const read = async ctx => {
    ctx.body = ctx.state.post;
};

/*
*   DELETE /api/posts/:id
* */
export const remove = async ctx => {
    const {id} = ctx.params;
    try{
        await Post.findByIdAndRemove(id).exec();
        ctx.staus = 204; // No Content (성공했지만 응답데이터 없음)
    }catch (e) {
        ctx.throw(500,e)
    }
};

/*
* PATCH /api/posts/:id
* {
*   title : '수정',
*   body : '수정 내용',
*   tags : ['수정','태그']
* }
* */
export const update = async ctx => {
    const {id} = ctx.params;

    // write에서 사용한 schema와 비슷하지만 required()가 없습니다.
    const schema = Joi.object().keys({
        title : Joi.string(),
        body : Joi.string(),
        tags : Joi.array().items(Joi.string()),
    })

    // 검증하고 나서 검증 실패인 경우 에러 처리
    const result = Joi.validate(ctx.request.body, schema);
    if(result.error){
        ctx.status = 400; // Bad request
        ctx.body = result.error;
        return;
    }

    try{
        const post = await Post.findByIdAndUpdate(id,ctx.request.body,{
            new : true, //이 값을 설정하면 업데이트된 데이터를 반환합니다.
            // false 일 때는 업데이트되기 전의 데이터를 반환합니다.
        }).exec();
        if(!post){
            ctx.status = 404;
            return ;
        }
        ctx.body = post;
    }catch (e) {
        ctx.throw(500,e)
    }
};
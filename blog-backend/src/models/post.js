import mongoose from 'mongoose';

const {Schema} = mongoose;

const PostSchema = new Schema({
    title : String,
    body : String,
    tags : [String], // 문자열로 이루어진 배열
    pubilshedDate : {
        type : Date,
        default : Date.now, // 현재날짜를 기본값으로 설정
    },
});

const Post = mongoose.model('Post', PostSchema); // 모델 인스턴스 생성
export default Post; // 모델 인스턴스 내보내기
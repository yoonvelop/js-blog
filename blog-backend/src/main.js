require('dotenv').config();
import Koa from 'koa';
import Router from 'koa-router';
import bodyParser from 'koa-bodyparser';
import mongoose from 'mongoose';

import api from './api';

// 비구조화 할당을 농해 process.env 내부 값에 대한 레퍼런스 만들기
const {PORT, MONGO_URI} = process.env;

mongoose
    .connect(MONGO_URI, {useNewUrlParser: true, useFindAndModify: false})
    .then(() => {
        console.log('connect to mongoDB');
    })
    .catch(e => {
    console.error(e);
});

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api', api.routes()); // api 라우터를 메인라우터의 /api경로로 설정

// 라우터 적용 전에 bodyParser적용/cod
app.use(bodyParser());

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

// PORT가 지정되어있지 않다면 4000을 사용
const port = PORT || 4000;
app.listen(port, () => {
    console.log('listening to port %d', port);
})
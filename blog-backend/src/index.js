const Koa = require('koa');
const Router = require('koa-router');

const api = require('./api');

const app = new Koa();
const router = new Router();

// 라우터 설정
router.use('/api',api.routes()); // api 라우터를 메인라우터의 /api경로로 설정

// app 인스턴스에 라우터 적용
app.use(router.routes()).use(router.allowedMethods());

app.listen(4000,()=>{
    console.log('listening to port 4000')
})
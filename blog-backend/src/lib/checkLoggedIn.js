const checkLoggedIn = (ctx,next) => {
    // 로그인상태가 아니면 401, 로그인 중이면 그 다음 미들웨어를 실행
    if(!ctx.state.user){
        ctx.status = 401; // Unauthorized
        return ;
    }
    return next();
};

export default checkLoggedIn;
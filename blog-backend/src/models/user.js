import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt'; // 해시 관련 라이브러리
import jwt from 'jsonwebtoken'; // jwt 라이브러리

const UserSchema = new Schema({
    username: String,
    hashedPassword: String,
});

// [인스턴스 메서드] 비밀번호 받아 해시 변경후 hashedPassword 설정
UserSchema.methods.setPassword = async function (password) {
    const hash = await bcrypt.hash(password, 10);
    this.hashedPassword = hash;
}

// [인스턴스 메서드] 비밀번호 받아 해당 계정 비밀번호와 일치하는지 확인
UserSchema.methods.checkPassword = async function (password) {
    const result = await bcrypt.compare(password, this.hashedPassword);
    return result; // true / false
}

// [스태틱 메서드] username으로 데이터 조회
UserSchema.statics.findByUsername = function (username) {
    return this.findOne({username});
}

// [인스턴스 메서드] hashedPassword 필드 지우고 리턴
UserSchema.methods.serialize = function (password) {
    const data = this.toJSON();
    delete data.hashedPassword;
    return data;
}

// [인스턴스 메서드] 토큰 생성
UserSchema.methods.generateToken = function () {
    const token = jwt.sign(
        // 첫번째 파라미터에는 토큰 안에 집어넣고 싶은 데이터를 넣습니다.
        {
            _id: this.id,
            username: this.username,
        },
        process.env.JWT_SECRET,// 두번째 파라미터에는 JWT 암호를 넣습니다.
        {expiresIn: '7d'}, // 7일 동안 유효함
    );
    return token;
};


const User = mongoose.model('User', UserSchema);
export default User;



import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt'; // 해시 관련 라이브러리

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

const User = mongoose.model('User', UserSchema);
export default User;



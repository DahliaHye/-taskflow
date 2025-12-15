import MongoDB from "mongodb";
import { useVirtualId } from "../db/database.mjs";
import mongoose from "mongoose";

// versionKey: Mongoose가 문서를 저장할 때 자동으로 추가하는 _v라는 필드를 설정
const userSchema = new mongoose.Schema(
  {
    userid: { type: String, require: true, unique: true },
    name: { type: String, require: true },
    email: { type: String, require: true },
    password: { type: String, require: true },
    role: { type: String, enum: ['admin', 'staff', 'user'], default: 'user' },
    url: String,
  },
  { versionKey: false }
);

useVirtualId(userSchema);
const User = mongoose.model("User", userSchema);

export async function createUser(user) {
  return new User(user).save().then((data) => data.id);
}

export async function findByUserid(userid) {
  return User.findOne({ userid });
}

export async function findById(id) {
  return User.findById(id);
}

// 모든 사용자 목록 조회 (비밀번호 제외)
export async function getAllUsers() {
  return User.find({}, { password: 0 }).sort({ name: 1 });
}

import express from "express";
import * as authRepository from "../data/auth.mjs";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { config } from "../config.mjs";

async function createJwtToken(id) {
  return jwt.sign({ id }, config.jwt.secretKey, {
    expiresIn: config.jwt.expiresInSec,
  });
}

export async function signup(req, res, next) {
  const { userid, password, name, role } = req.body;

  // 회원 중복 체크
  const found = await authRepository.findByUserid(userid);
  if (found) {
    return res.status(409).json({ message: `${userid}이 이미 있습니다` });
  }

  const hashed = bcrypt.hashSync(password, config.bcrypt.saltRounds);
  const userId = await authRepository.createUser({
    userid,
    password: hashed,
    name,
    email: userid, // email 필드가 required이므로 임시로 userid 사용
    role: role || 'user',
  });
  const token = await createJwtToken(userId);
  const user = await authRepository.findById(userId);
  res.status(201).json({ token, id: user.id, userid: user.userid, name: user.name, role: user.role });
}

export async function login(req, res, next) {
  const { userid, password } = req.body;
  const user = await authRepository.findByUserid(userid);
  if (!user) {
    return res.status(401).json({ message: `${userid} 를 찾을 수 없음` });
  }
  const isValidPassword = await bcrypt.compare(password, user.password);
  if (!isValidPassword) {
    return res.status(401).json({ message: `아이디 또는 비밀번호 확인` });
  }

  const token = await createJwtToken(user.id);
  res.status(200).json({ token, id: user.id, userid: user.userid, name: user.name, role: user.role });
}

export async function me(req, res, next) {
  const user = await authRepository.findById(req.id);
  if (!user) {
    return res.status(404).json({ message: "일치하는 사용자가 없음" });
  }
  // 토큰을 헤더에서 가져오기
  const authHeader = req.get("Authorization");
  const token = authHeader ? authHeader.split(" ")[1] : null;
  res.status(200).json({ token, id: user.id, userid: user.userid, name: user.name, role: user.role });
}

// 모든 사용자 목록 조회
export async function getUsers(req, res, next) {
  try {
    const users = await authRepository.getAllUsers();
    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
}

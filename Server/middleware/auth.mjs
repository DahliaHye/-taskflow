import jwt from "jsonwebtoken";
import * as authRepository from "../data/auth.mjs";
import { config } from "../config.mjs";

const AUTH_ERROR = { message: "인증 에러" };

export const isAuth = async (req, res, next) => {
  const authHeader = req.get("Authorization");
  // console.log(authHeader);

  if (!(authHeader && authHeader.startsWith("Bearer "))) {
    console.log("헤더 에러");
    return res.status(401).json(AUTH_ERROR);
  }

  // Authorization:Bearer QEWRASDFDSAFSADFASDFD==
  const token = authHeader.split(" ")[1];
  // console.log("토큰 분리 성공", token);

  jwt.verify(token, config.jwt.secretKey, async (error, decoded) => {
    if (error) {
      console.log("토큰 에러");
      return res.status(401).json(AUTH_ERROR);
    }
    // console.log(decoded);
    const user = await authRepository.findById(decoded.id);
    if (!user) {
      console.log("아이디 없음");
      return res.status(401).json(AUTH_ERROR);
    }
    console.log("user.id: ", user.id);
    console.log("user.userid: ", user.userid);
    req.id = user.id;
    req.role = user.role; // 사용자 역할 저장 (admin 권한 확인용)
    req.token = token; // 토큰을 req에 저장
    next();
  });
};

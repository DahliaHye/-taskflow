import express from "express";
import * as authController from "../controller/auth.mjs";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

const validateLogin = [
  body("userid")
    .trim()
    .isLength({ min: 4 })
    .withMessage("최소 4자이상 입력")
    .matches(/^[a-zA-Z0-9]+$/)
    .withMessage("특수문자 사용불가"),
  body("password").trim().isLength({ min: 4 }).withMessage("최소 4자이상 입력"),
  validate,
];

const validateSignup = [
  ...validateLogin,
  body("name").trim().notEmpty().withMessage("name을 입력"),
  body("role").optional().isIn(['admin', 'staff', 'user']).withMessage("유효한 역할을 입력하세요"),
  validate,
];

// 회원 가입
router.post("/signup", validateSignup, authController.signup);

// 로그인
router.post("/login", validateLogin, authController.login);

// 로그인 유지
router.post("/me", isAuth, authController.me);

// 모든 사용자 목록 조회
router.get("/users", isAuth, authController.getUsers);

export default router;

import express from "express";
import * as commentController from "../controller/comment.mjs";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

const validateComment = [
  body("content").trim().isLength({ min: 1 }).withMessage("댓글 내용을 입력하세요"),
  validate,
];

// 특정 업무의 댓글 목록 조회
router.get("/task/:taskId", isAuth, commentController.getComments);

// 댓글 작성
router.post("/task/:taskId", isAuth, validateComment, commentController.createComment);

// 댓글 삭제
router.delete("/:id", isAuth, commentController.deleteComment);

export default router;



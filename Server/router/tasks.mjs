import express from "express";
import * as taskController from "../controller/task.mjs";
import { body } from "express-validator";
import { validate } from "../middleware/validator.mjs";
import { isAuth } from "../middleware/auth.mjs";

const router = express.Router();

const validateTask = [
  body("title").trim().isLength({ min: 1 }).withMessage("제목을 입력하세요"),
  body("description").trim().isLength({ min: 1 }).withMessage("설명을 입력하세요"),
  body("status").optional().isIn(['TODO', 'IN_PROGRESS', 'DONE']).withMessage("유효한 상태를 입력하세요"),
  body("priority").optional().isIn(['LOW', 'MEDIUM', 'HIGH']).withMessage("유효한 우선순위를 입력하세요"),
  validate,
];

// 전체 업무 목록 조회 (필터링 지원)
// GET /tasks?status=TODO&priority=HIGH&assignee=userId
router.get("/", isAuth, taskController.getTasks);

// 특정 업무 조회
router.get("/:id", isAuth, taskController.getTask);

// 업무 생성
router.post("/", isAuth, validateTask, taskController.createTask);

// 업무 수정
router.put("/:id", isAuth, validateTask, taskController.updateTask);

// 업무 삭제
router.delete("/:id", isAuth, taskController.deleteTask);

export default router;



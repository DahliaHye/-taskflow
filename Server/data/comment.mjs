import mongoose from "mongoose";
import { useVirtualId } from "../db/database.mjs";

const commentSchema = new mongoose.Schema(
  {
    taskId: { type: mongoose.Schema.Types.ObjectId, ref: 'Task', require: true },
    writerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    content: { type: String, require: true },
  },
  { timestamps: true }
);

useVirtualId(commentSchema);
const Comment = mongoose.model("Comment", commentSchema);

// 특정 업무의 댓글 목록 조회
export async function getAllByTaskId(taskId) {
  return Comment.find({ taskId })
    .populate('writerId', 'userid name')
    .sort({ createdAt: -1 });
}

// 댓글 ID로 조회
export async function getById(id) {
  return Comment.findById(id).populate('writerId', 'userid name');
}

// 댓글 생성
export async function create(taskId, writerId, content) {
  const comment = new Comment({
    taskId,
    writerId,
    content,
  });
  return comment.save();
}

// 댓글 삭제
export async function remove(id) {
  return Comment.findByIdAndDelete(id);
}



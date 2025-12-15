import mongoose from "mongoose";
import { useVirtualId } from "../db/database.mjs";
import * as UserRepository from "./auth.mjs";

const taskSchema = new mongoose.Schema(
  {
    title: { type: String, require: true },
    description: { type: String, require: true },
    status: { 
      type: String, 
      enum: ['TODO', 'IN_PROGRESS', 'DONE'], 
      default: 'TODO',
      require: true 
    },
    priority: { 
      type: String, 
      enum: ['LOW', 'MEDIUM', 'HIGH'], 
      default: 'MEDIUM',
      require: true 
    },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', require: true },
    dueDate: { type: Date },
  },
  { timestamps: true }
);

useVirtualId(taskSchema);
const Task = mongoose.model("Task", taskSchema);

// 모든 업무를 리턴 (필터링 지원)
export async function getAll(filters = {}) {
  const query = {};
  if (filters.status) query.status = filters.status;
  if (filters.priority) query.priority = filters.priority;
  if (filters.assignee) {
    // assignee가 유효한 ObjectId인 경우에만 필터링
    if (mongoose.Types.ObjectId.isValid(filters.assignee)) {
      query.assignee = filters.assignee;
    }
  }
  
  return Task.find(query)
    .populate('assignee', 'userid name')
    .populate('creator', 'userid name')
    .sort({ createdAt: -1 });
}

// 특정 사용자가 담당자인 업무만 리턴
export async function getAllByAssignee(assigneeId) {
  return Task.find({ assignee: assigneeId })
    .populate('assignee', 'userid name')
    .populate('creator', 'userid name')
    .sort({ createdAt: -1 });
}

// 업무 ID로 조회
export async function getById(id) {
  return Task.findById(id)
    .populate('assignee', 'userid name')
    .populate('creator', 'userid name');
}

// 업무 생성
export async function create(taskData, creatorId) {
  const task = new Task({
    ...taskData,
    creator: creatorId,
  });
  return task.save();
}

// 업무 수정
export async function update(id, updateData) {
  return Task.findByIdAndUpdate(
    id, 
    { ...updateData, updatedAt: new Date() }, 
    { returnDocument: "after" }
  ).populate('assignee', 'userid name')
   .populate('creator', 'userid name');
}

// 업무 삭제
export async function remove(id) {
  return Task.findByIdAndDelete(id);
}


import React from "react";
import { useAuth } from "../context/AuthContext";

const TaskCard = ({ task, onView, onEdit, onDelete }) => {
  const { user } = useAuth();
  
  // 생성자 또는 admin만 수정/삭제 가능
  const isCreator = user?.id && (String(task.creator?.id || task.creator?._id || "") === String(user.id));
  const isAdmin = user?.role === "admin";
  const canEdit = isCreator || isAdmin;
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR");
  };

  return (
    <li className="task-card" onClick={onView}>
      <div className="post-container">
        <div className="post-body">
          <div style={{ marginBottom: "8px" }}>
            <span className={`task-status task-status-${task.status}`}>
              {task.status === "TODO" ? "할 일" : 
               task.status === "IN_PROGRESS" ? "진행 중" : "완료"}
            </span>
            <span className={`task-priority task-priority-${task.priority}`}>
              {task.priority === "LOW" ? "낮음" : 
               task.priority === "MEDIUM" ? "보통" : "높음"}
            </span>
          </div>
          <div className="post-name" style={{ fontSize: "1.2rem", marginBottom: "8px" }}>
            {task.title}
          </div>
          <div style={{ color: "var(--color-darkGrey)", marginBottom: "8px" }}>
            {task.description}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--color-darkGrey)" }}>
            <span>생성자: {task.creator?.name || "알 수 없음"}</span>
            {task.assignee && (
              <span style={{ marginLeft: "12px" }}>
                담당자: {task.assignee.name || "미지정"}
              </span>
            )}
            {task.dueDate && (
              <span style={{ marginLeft: "12px" }}>
                마감일: {formatDate(task.dueDate)}
              </span>
            )}
            {task.updatedAt && (
              <span style={{ marginLeft: "12px" }}>
                수정: {formatDate(task.updatedAt)}
              </span>
            )}
          </div>
        </div>
        {canEdit && (
          <div className="post-action">
            <button
              className="post-action-btn"
              onClick={(e) => {
                e.stopPropagation();
                onEdit();
              }}
            >
              ✏️
            </button>
            <button
              className="post-action-btn post-delete"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
            >
              🗑️
            </button>
          </div>
        )}
      </div>
    </li>
  );
};

export default TaskCard;


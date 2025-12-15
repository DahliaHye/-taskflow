import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TaskDetail = ({ taskService, commentService }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [task, setTask] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentContent, setCommentContent] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTask();
    loadComments();
  }, [id]);

  const loadTask = async () => {
    try {
      setLoading(true);
      const data = await taskService.getTask(id);
      if (!data) {
        throw new Error("업무를 찾을 수 없습니다.");
      }
      setTask(data);
    } catch (error) {
      console.error("업무 로드 실패:", error);
      const errorMessage = error.message || "업무를 불러올 수 없습니다.";
      alert(errorMessage);
      navigate("/tasks");
    } finally {
      setLoading(false);
    }
  };

  const loadComments = async () => {
    try {
      const data = await commentService.getComments(id);
      setComments(data);
    } catch (error) {
      console.error("댓글 로드 실패:", error);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentContent.trim()) return;

    try {
      await commentService.createComment(id, commentContent);
      setCommentContent("");
      loadComments();
    } catch (error) {
      console.error("댓글 작성 실패:", error);
      alert("댓글 작성에 실패했습니다.");
    }
  };

  const handleCommentDelete = async (commentId) => {
    if (window.confirm("댓글을 삭제하시겠습니까?")) {
      try {
        await commentService.deleteComment(commentId);
        loadComments();
      } catch (error) {
        console.error("댓글 삭제 실패:", error);
        alert("댓글 삭제에 실패했습니다.");
      }
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString("ko-KR") + " " + date.toLocaleTimeString("ko-KR");
  };

  if (loading) {
    return <div className="task-detail">로딩 중...</div>;
  }

  if (!task) {
    return <div className="task-detail">업무를 찾을 수 없습니다.</div>;
  }

  // 생성자 또는 admin만 수정/삭제 가능 (ID를 문자열로 비교)
  const creatorId = String(task.creator?.id || task.creator?._id || "");
  const userId = String(user?.id || "");
  const isCreator = userId && creatorId === userId;
  const isAdmin = user?.role === "admin";
  const canEdit = isCreator || isAdmin;

  return (
    <div className="task-detail">
      <div className="task-detail-header">
        <h1 className="task-detail-title">{task.title}</h1>
        <div className="task-detail-meta">
          <span className={`task-status task-status-${task.status}`}>
            {task.status === "TODO" ? "할 일" : 
             task.status === "IN_PROGRESS" ? "진행 중" : "완료"}
          </span>
          <span className={`task-priority task-priority-${task.priority}`}>
            {task.priority === "LOW" ? "낮음" : 
             task.priority === "MEDIUM" ? "보통" : "높음"}
          </span>
          <span>생성자: {task.creator?.name || "알 수 없음"}</span>
          {task.assignee && <span>담당자: {task.assignee.name}</span>}
          {task.dueDate && <span>마감일: {formatDate(task.dueDate)}</span>}
          {task.createdAt && <span>작성: {formatDate(task.createdAt)}</span>}
          {task.updatedAt && <span>수정: {formatDate(task.updatedAt)}</span>}
        </div>
        <div>
          {canEdit && (
            <button
              className="form-btn"
              onClick={() => navigate(`/tasks/${id}/edit`)}
              style={{ marginRight: "8px" }}
            >
              수정
            </button>
          )}
          <button
            className="form-btn form-btn-cancel"
            onClick={() => navigate("/tasks")}
          >
            목록으로
          </button>
        </div>
      </div>
      <div className="task-detail-description">{task.description}</div>
      
      <div className="comments-section">
        <h2>댓글 ({comments.length})</h2>
        <div>
          {comments.map((comment) => (
            <div key={comment.id} className="comment">
              <div style={{ marginBottom: "8px" }}>
                <strong>{comment.writerId?.name || "알 수 없음"}</strong>
                <span style={{ marginLeft: "12px", fontSize: "0.8rem", color: "var(--color-darkGrey)" }}>
                  {formatDate(comment.createdAt)}
                </span>
                {String(comment.writerId?.id || comment.writerId?._id || "") === String(user?.id || "") && (
                  <button
                    className="post-action-btn"
                    onClick={() => handleCommentDelete(comment.id)}
                    style={{ float: "right" }}
                  >
                    삭제
                  </button>
                )}
              </div>
              <div>{comment.content}</div>
            </div>
          ))}
        </div>
        <form className="comment-form" onSubmit={handleCommentSubmit}>
          <textarea
            className="comment-input"
            value={commentContent}
            onChange={(e) => setCommentContent(e.target.value)}
            placeholder="댓글을 입력하세요..."
            rows="3"
            required
          />
          <button type="submit" className="form-btn">
            댓글 작성
          </button>
        </form>
      </div>
    </div>
  );
};

export default TaskDetail;


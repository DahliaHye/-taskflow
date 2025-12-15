import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const TaskForm = ({ taskService, authService }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "TODO",
    priority: "MEDIUM",
    assignee: "",
    dueDate: "",
  });

  useEffect(() => {
    loadUsers();
    if (isEdit) {
      loadTask();
    }
  }, [id]);

  const loadUsers = async () => {
    try {
      const userList = await authService.getUsers();
      setUsers(userList);
    } catch (error) {
      console.error("사용자 목록 로드 실패:", error);
    }
  };

  const loadTask = async () => {
    try {
      const task = await taskService.getTask(id);
      setFormData({
        title: task.title || "",
        description: task.description || "",
        status: task.status || "TODO",
        priority: task.priority || "MEDIUM",
        assignee: task.assignee?.id || "",
        dueDate: task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "",
      });
    } catch (error) {
      console.error("업무 로드 실패:", error);
      alert("업무를 불러올 수 없습니다.");
      navigate("/tasks");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const submitData = {
        ...formData,
        assignee: formData.assignee || undefined,
        dueDate: formData.dueDate || undefined,
      };

      if (isEdit) {
        await taskService.updateTask(id, submitData);
      } else {
        await taskService.createTask(submitData);
      }
      navigate("/tasks");
    } catch (error) {
      console.error("업무 저장 실패:", error);
      alert("업무 저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-detail">
      <h1 className="task-detail-title">
        {isEdit ? "업무 수정" : "새 업무 생성"}
      </h1>
      <form className="auth-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="title"
          placeholder="제목"
          value={formData.title}
          onChange={handleChange}
          className="form-input"
          required
        />
        <textarea
          name="description"
          placeholder="설명"
          value={formData.description}
          onChange={handleChange}
          className="form-input"
          rows="5"
          required
        />
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="form-input"
        >
          <option value="TODO">할 일</option>
          <option value="IN_PROGRESS">진행 중</option>
          <option value="DONE">완료</option>
        </select>
        <select
          name="priority"
          value={formData.priority}
          onChange={handleChange}
          className="form-input"
        >
          <option value="LOW">낮음</option>
          <option value="MEDIUM">보통</option>
          <option value="HIGH">높음</option>
        </select>
        <select
          name="assignee"
          value={formData.assignee}
          onChange={handleChange}
          className="form-input"
        >
          <option value="">담당자 선택 (선택사항)</option>
          {users.map((user) => (
            <option key={user.id} value={user.id}>
              {user.name} ({user.userid})
            </option>
          ))}
        </select>
        <input
          type="date"
          name="dueDate"
          value={formData.dueDate}
          onChange={handleChange}
          className="form-input"
        />
        <div style={{ display: "flex", gap: "8px" }}>
          <button type="submit" className="form-btn" disabled={loading}>
            {loading ? "저장 중..." : isEdit ? "수정" : "생성"}
          </button>
          <button
            type="button"
            className="form-btn form-btn-cancel"
            onClick={() => navigate("/tasks")}
          >
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm;


import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";

const MyPage = ({ taskService }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadMyTasks();
  }, []);

  const loadMyTasks = async () => {
    try {
      setLoading(true);
      // assignee 필터로 내가 담당자인 업무만 가져오기
      const data = await taskService.getTasks({ assignee: user?.id });
      setTasks(data);
    } catch (error) {
      console.error("내 업무 로드 실패:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await taskService.deleteTask(taskId);
        loadMyTasks();
      } catch (error) {
        console.error("삭제 실패:", error);
        alert("삭제에 실패했습니다.");
      }
    }
  };

  if (loading) {
    return <div className="tasks">로딩 중...</div>;
  }

  return (
    <div>
      <div style={{ padding: "24px" }}>
        <h1 style={{ color: "var(--color-purple-light)", marginBottom: "16px" }}>
          내 업무 ({tasks.length})
        </h1>
      </div>
      <ul className="tasks">
        {tasks.length === 0 ? (
          <li className="posts-empty">담당자로 지정된 업무가 없습니다.</li>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onView={() => navigate(`/tasks/${task.id}`)}
              onEdit={() => navigate(`/tasks/${task.id}/edit`)}
              onDelete={() => handleDelete(task.id)}
            />
          ))
        )}
      </ul>
    </div>
  );
};

export default MyPage;


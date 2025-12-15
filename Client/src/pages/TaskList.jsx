import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import TaskCard from "../components/TaskCard";

const TaskList = ({ taskService, commentService }) => {
  const { user } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    assignee: "",
    myTasksOnly: false,
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadTasks();
  }, [filters, user]);
  
  // URL 파라미터에서 myTasksOnly 확인
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const myTasksOnly = urlParams.get('myTasksOnly') === 'true';
    if (myTasksOnly) {
      setFilters(prev => ({ ...prev, myTasksOnly: true }));
    }
  }, []);

  const loadTasks = async () => {
    try {
      setLoading(true);
      const filterParams = { ...filters };
      
      // myTasksOnly는 API에 전송하지 않음 (프론트엔드에서 필터링)
      const myTasksOnly = filterParams.myTasksOnly;
      delete filterParams.myTasksOnly;
      
      const data = await taskService.getTasks(filterParams);
      
      // 내가 생성한 업무만 필터링 (프론트엔드에서)
      if (myTasksOnly && user?.id) {
        const userId = user.id;
        const filteredData = data.filter(task => {
          const creatorId = task.creator?.id || task.creator?._id;
          return String(creatorId) === String(userId);
        });
        setTasks(filteredData);
      } else {
        setTasks(data);
      }
    } catch (error) {
      console.error("업무 목록 로드 실패:", error);
      alert("업무 목록을 불러올 수 없습니다: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    setFilters((prev) => {
      if (key === "myTasksOnly") {
        return {
          ...prev,
          myTasksOnly: value,
          // 내 글만 선택 시 다른 필터 초기화
          ...(value ? { status: "", priority: "", assignee: "" } : {}),
        };
      }
      return {
        ...prev,
        [key]: value || "",
        // 다른 필터 선택 시 내 글만 해제
        myTasksOnly: false,
      };
    });
  };

  const handleDelete = async (taskId) => {
    if (window.confirm("정말 삭제하시겠습니까?")) {
      try {
        await taskService.deleteTask(taskId);
        loadTasks();
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
      <div className="filter-section">
        <select
          className="filter-select"
          value={filters.status}
          onChange={(e) => handleFilterChange("status", e.target.value)}
        >
          <option value="">전체 상태</option>
          <option value="TODO">TODO</option>
          <option value="IN_PROGRESS">진행 중</option>
          <option value="DONE">완료</option>
        </select>
        <select
          className="filter-select"
          value={filters.priority}
          onChange={(e) => handleFilterChange("priority", e.target.value)}
        >
          <option value="">전체 우선순위</option>
          <option value="LOW">낮음</option>
          <option value="MEDIUM">보통</option>
          <option value="HIGH">높음</option>
        </select>
        <label style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
          <input
            type="checkbox"
            checked={filters.myTasksOnly}
            onChange={(e) => handleFilterChange("myTasksOnly", e.target.checked)}
            style={{ width: "18px", height: "18px", cursor: "pointer" }}
          />
          <span style={{ color: "var(--color-white)" }}>내 업무만</span>
        </label>
        <button
          className="form-btn"
          onClick={() => navigate("/tasks/new")}
        >
          새 업무 생성
        </button>
      </div>
      <ul className="tasks">
        {tasks.length === 0 ? (
          <li className="posts-empty">업무가 없습니다.</li>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id || task._id}
              task={task}
              onView={() => navigate(`/tasks/${task.id || task._id}`)}
              onEdit={() => navigate(`/tasks/${task.id || task._id}/edit`)}
              onDelete={() => handleDelete(task.id || task._id)}
            />
          ))
        )}
      </ul>
    </div>
  );
};

export default TaskList;


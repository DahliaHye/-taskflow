import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import "./App.css";
import Header from "./components/Header";
import { useAuth } from "./context/AuthContext";
import TaskList from "./pages/TaskList";
import TaskDetail from "./pages/TaskDetail";
import TaskForm from "./pages/TaskForm";
import MyPage from "./pages/MyPage";
import Login from "./pages/Login";
import Register from "./pages/Register";

function App({ taskService, commentService, authService }) {
  const { user, logOut } = useAuth();

  return (
    <div className="app">
      <Header user={user} onLogOut={logOut} />
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route
          path="/tasks"
          element={<TaskList taskService={taskService} commentService={commentService} />}
        />
        <Route
          path="/tasks/new"
          element={<TaskForm taskService={taskService} authService={authService} />}
        />
        <Route
          path="/tasks/:id"
          element={<TaskDetail taskService={taskService} commentService={commentService} />}
        />
        <Route
          path="/tasks/:id/edit"
          element={<TaskForm taskService={taskService} authService={authService} />}
        />
        <Route
          path="/mypage"
          element={<MyPage taskService={taskService} />}
        />
        <Route path="/" element={<Navigate to="/tasks" replace />} />
      </Routes>
    </div>
  );
}

export default App;

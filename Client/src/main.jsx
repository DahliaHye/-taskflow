import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
// npm i react-router-dom
import { BrowserRouter } from "react-router-dom";
import TokenStorage from "./db/token.js";
import AuthService from "./service/auth.js";
import TaskService from "./service/task.js";
import CommentService from "./service/comment.js";
import HttpClient from "./network/http.js";
import { AuthErrorEventBus, AuthProvider } from "./context/AuthContext.jsx";
// Backend 서버 URL 설정 (포트 9090)
const baseURL = import.meta.env.VITE_REACT_APP_BASE_URL || "http://localhost:9090";
console.log("🌐 API Base URL:", baseURL);
if (baseURL.includes("8080")) {
  console.warn("⚠️ 포트가 8080으로 설정되어 있습니다. 9090으로 변경하세요!");
}
const tokenStorage = new TokenStorage();
const httpClient = new HttpClient(baseURL);
const authService = new AuthService(httpClient, tokenStorage);
// tokenStorage를 authService에 직접 연결 (접근용)
authService.tokenStorage = tokenStorage;
const taskService = new TaskService(httpClient, tokenStorage);
const commentService = new CommentService(httpClient, tokenStorage);
const authErrorEventBus = new AuthErrorEventBus();
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider
        authService={authService}
        authErrorEventBus={authErrorEventBus}
      >
        <App taskService={taskService} commentService={commentService} authService={authService} />
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);

import express from "express";
import tasksRouter from "./router/tasks.mjs";
import commentsRouter from "./router/comments.mjs";
import authRouter from "./router/auth.mjs";
import { config } from "./config.mjs";
import { connectDB } from "./db/database.mjs";
import cors from "cors";

const app = express();

app.use(express.json());
// CORS 설정 - 모든 origin 허용 (개발 환경)
app.use(cors({
  origin: '*',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use("/tasks", tasksRouter);
app.use("/comments", commentsRouter);
app.use("/auth", authRouter);

app.use((req, res, next) => {
  res.sendStatus(404);
});

connectDB()
  .then(() => {
    app.listen(config.host.port, () => {
      console.log(`✅ Server is running on http://localhost:${config.host.port}`);
      console.log(`📡 API endpoints:`);
      console.log(`   - POST http://localhost:${config.host.port}/auth/signup`);
      console.log(`   - POST http://localhost:${config.host.port}/auth/login`);
      console.log(`   - GET  http://localhost:${config.host.port}/tasks`);
    });
  })
  .catch((error) => {
    console.error("❌ Database connection failed:", error);
    console.error("💡 Make sure MongoDB is running or check DB_HOST in .env file");
    process.exit(1);
  });

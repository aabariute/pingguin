import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { fileURLToPath } from "node:url";
import path from "path";
import globalErrorHandler from "./controllers/error.controller.js";
import { connectDB } from "./lib/db.js";
import { app, server } from "./lib/socket.js";
import authRoutes from "./routes/auth.route.js";
import messageRoutes from "./routes/message.route.js";
import userRoutes from "./routes/user.route.js";

dotenv.config();

const port = process.env.PORT ?? 5000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const projectRoot = path.resolve(__dirname, ".."); // backend/
const frontendDist = path.resolve(projectRoot, "../frontend/dist");

app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// ROUTES
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/users", userRoutes);

app.use(globalErrorHandler);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(frontendDist));

  app.get(/.*/, (_req, res) => {
    res.sendFile(path.join(frontendDist, "index.html"));
  });
}

server.listen(port, () => {
  console.log(`Listening on port ${port}...`);
  connectDB();
});

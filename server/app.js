import express from "express";
import cors from "cors";
import resumeRoutes from "./routes/resumeRoutes.js";

import authRoutes from "./routes/authRoutes.js";
import interviewRoutes from "./routes/interviewRoutes.js";



const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/api/resume", resumeRoutes);

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/interviews", interviewRoutes);

// Test Route
app.get("/", (req, res) => {
  res.send("AI Interview Platform API is running...");
});

export default app;
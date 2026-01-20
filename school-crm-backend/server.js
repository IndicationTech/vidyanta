import dotenv from "dotenv";
import cors from "cors";
import connectDB from "./config/db.js";
import path from "path";
import { fileURLToPath } from "url";

import leadRoutes from "./routes/leadRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import documentRoutes from "./routes/documentRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import studentRoutes from "./routes/studentRoutes.js";
import syllabusRoutes from "./routes/syllabusRoutes.js";

import geminiRoutes from "./routes/gemini.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();
import express from "express";
connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/leads", leadRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/students", studentRoutes);
app.use("/api/syllabus", syllabusRoutes);
app.use("/uploads", express.static(path.join(__dirname, "src/uploads")));
app.use("/api/gemini", geminiRoutes);

app.get("/", (req, res) => {
  res.send("School CRM API running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

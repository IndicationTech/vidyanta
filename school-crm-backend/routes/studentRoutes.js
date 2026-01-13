import express from "express";
import {
  getAllStudents,
  getStudentById,
  createStudent,
  createBulkStudents,
  updateStudent,
  deleteStudent,
  searchStudents,
} from "../controllers/studentController.js";

const router = express.Router();

// GET routes
router.get("/", getAllStudents);
router.get("/search", searchStudents);
router.get("/:id", getStudentById);

// POST routes
router.post("/", createStudent);
router.post("/bulk", createBulkStudents);

// PUT routes
router.put("/:id", updateStudent);

// DELETE routes
router.delete("/:id", deleteStudent);

export default router;

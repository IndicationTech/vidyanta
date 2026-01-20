import express from "express";
import {
  getAllTimetables,
  getTimetableByClass,
  getTimetableById,
  createTimetable,
  updateTimetable,
  updateTimetableByClass,
  deleteTimetable,
  deletePeriod,
  getAvailableClasses,
} from "../controllers/timetableController.js";
import { protect, authorize, isAdmin } from "../middleware/auth.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// Public routes (all authenticated users can access)
// Get list of available classes
router.get("/classes", getAvailableClasses);

// Get all timetables
router.get("/", getAllTimetables);

// Get timetable by class name
router.get("/class/:className", getTimetableByClass);

// Get timetable by ID
router.get("/:id", getTimetableById);

// Admin-only routes (SUPER_ADMIN and SCHOOL_ADMIN)
// Create new timetable
router.post("/", isAdmin, createTimetable);

// Update timetable by ID
router.put("/:id", isAdmin, updateTimetable);

// Update timetable by class name (upsert)
router.put("/class/:className", isAdmin, updateTimetableByClass);

// Delete timetable
router.delete("/:id", isAdmin, deleteTimetable);

// Delete specific period from timetable
router.delete("/:id/period", isAdmin, deletePeriod);

export default router;

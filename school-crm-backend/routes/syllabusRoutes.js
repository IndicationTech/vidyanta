import express from "express";
import mongoose from "mongoose";
import Syllabus from "../models/Syllabus.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// Get all syllabus for a school (admin view)
router.get("/", protect, async (req, res) => {
  try {
    const { schoolId, standard, subject, semester } = req.query;

    const filter = {};
    if (schoolId) filter.schoolId = schoolId;
    if (standard) filter.standard = standard;
    if (subject) filter.subject = subject;
    if (semester) filter.semester = parseInt(semester);

    const syllabi = await Syllabus.find(filter)
      .populate("assignedTeachers", "name email")
      .populate("createdBy", "name email")
      .sort({ standard: 1, subject: 1, semester: 1 });

    res.json(syllabi);
  } catch (error) {
    console.error("Error fetching syllabus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get syllabus for a specific teacher
router.get("/teacher/:teacherId", protect, async (req, res) => {
  try {
    const { teacherId } = req.params;

    // First, get the teacher's profile to know their assigned classes, subjects, and sections
    const User = mongoose.model("User");
    const teacher = await User.findById(teacherId);

    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Parse teacher's assigned classes and subjects
    const teacherClasses = Array.isArray(teacher.classAssigned)
      ? teacher.classAssigned
      : teacher.classAssigned
        ? teacher.classAssigned.split(",").map((c) => c.trim())
        : [];

    const teacherSubjects = Array.isArray(teacher.subject)
      ? teacher.subject
      : teacher.subject
        ? teacher.subject.split(",").map((s) => s.trim())
        : [];

    // Parse teacher's sections if available
    const teacherSections = Array.isArray(teacher.section)
      ? teacher.section
      : teacher.section
        ? teacher.section.split(",").map((s) => s.trim())
        : [];

    // Build query to find syllabi that match teacher's profile
    const query = {
      standard: { $in: teacherClasses },
      subject: { $in: teacherSubjects },
    };

    // If teacher has sections assigned, filter by those sections
    // If syllabus has sections, at least one must match teacher's sections
    // If syllabus has no sections or teacher has no sections, include it
    const syllabi = await Syllabus.find(query)
      .populate("createdBy", "name email")
      .sort({ standard: 1, subject: 1, semester: 1 });

    // Filter syllabi based on section matching
    const filteredSyllabi = syllabi.filter((syllabus) => {
      // If syllabus has no sections, include it
      if (!syllabus.section || syllabus.section.length === 0) {
        return true;
      }

      // If teacher has no sections, include all syllabi for their class/subject
      if (teacherSections.length === 0) {
        return true;
      }

      // Check if any of the teacher's sections match any of the syllabus sections
      return syllabus.section.some((sec) => teacherSections.includes(sec));
    });

    res.json(filteredSyllabi);
  } catch (error) {
    console.error("Error fetching teacher syllabus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Get a single syllabus by ID
router.get("/:id", protect, async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id)
      .populate("assignedTeachers", "name email")
      .populate("createdBy", "name email");

    if (!syllabus) {
      return res.status(404).json({ message: "Syllabus not found" });
    }

    res.json(syllabus);
  } catch (error) {
    console.error("Error fetching syllabus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Create a new syllabus
router.post("/", protect, async (req, res) => {
  try {
    const {
      schoolId,
      standard,
      subject,
      semester,
      section,
      syllabusData,
      assignedTeachers,
    } = req.body;

    // Check if syllabus already exists for this combination
    const existingSyllabus = await Syllabus.findOne({
      schoolId,
      standard,
      subject,
      semester,
    });

    if (existingSyllabus) {
      return res.status(400).json({
        message:
          "Syllabus already exists for this standard, subject, and semester",
      });
    }

    const syllabus = new Syllabus({
      schoolId,
      standard,
      subject,
      semester,
      section: section || [],
      syllabusData,
      assignedTeachers: assignedTeachers || [],
      createdBy: req.user._id,
    });

    const savedSyllabus = await syllabus.save();

    const populatedSyllabus = await Syllabus.findById(savedSyllabus._id)
      .populate("assignedTeachers", "name email")
      .populate("createdBy", "name email");

    res.status(201).json(populatedSyllabus);
  } catch (error) {
    console.error("Error creating syllabus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Update a syllabus
router.put("/:id", protect, async (req, res) => {
  try {
    const {
      syllabusData,
      assignedTeachers,
      standard,
      subject,
      semester,
      section,
    } = req.body;

    const syllabus = await Syllabus.findById(req.params.id);

    if (!syllabus) {
      return res.status(404).json({ message: "Syllabus not found" });
    }

    // Update fields if provided
    if (syllabusData) syllabus.syllabusData = syllabusData;
    if (assignedTeachers !== undefined)
      syllabus.assignedTeachers = assignedTeachers;
    if (standard) syllabus.standard = standard;
    if (subject) syllabus.subject = subject;
    if (semester) syllabus.semester = semester;
    if (section !== undefined) syllabus.section = section;

    const updatedSyllabus = await syllabus.save();

    const populatedSyllabus = await Syllabus.findById(updatedSyllabus._id)
      .populate("assignedTeachers", "name email")
      .populate("createdBy", "name email");

    res.json(populatedSyllabus);
  } catch (error) {
    console.error("Error updating syllabus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Delete a syllabus
router.delete("/:id", protect, async (req, res) => {
  try {
    const syllabus = await Syllabus.findById(req.params.id);

    if (!syllabus) {
      return res.status(404).json({ message: "Syllabus not found" });
    }

    await Syllabus.deleteOne({ _id: req.params.id });

    res.json({ message: "Syllabus deleted successfully" });
  } catch (error) {
    console.error("Error deleting syllabus:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// Assign teachers to syllabus
router.post("/:id/assign-teachers", protect, async (req, res) => {
  try {
    const { teacherIds } = req.body;

    const syllabus = await Syllabus.findById(req.params.id);

    if (!syllabus) {
      return res.status(404).json({ message: "Syllabus not found" });
    }

    syllabus.assignedTeachers = teacherIds;
    await syllabus.save();

    const populatedSyllabus = await Syllabus.findById(syllabus._id)
      .populate("assignedTeachers", "name email")
      .populate("createdBy", "name email");

    res.json(populatedSyllabus);
  } catch (error) {
    console.error("Error assigning teachers:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

export default router;

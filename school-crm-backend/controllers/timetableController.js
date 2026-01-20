import Timetable from "../models/Timetable.js";

/**
 * @desc    Get all timetables
 * @route   GET /api/timetables
 * @access  Private
 */
export const getAllTimetables = async (req, res) => {
  try {
    const timetables = await Timetable.find({ isActive: true })
      .sort({ className: 1, section: 1 })
      .populate("createdBy", "name email")
      .populate("updatedBy", "name email");

    const formattedTimetables = timetables.map((tt) => tt.formatForFrontend());

    res.status(200).json({
      success: true,
      count: timetables.length,
      data: formattedTimetables,
    });
  } catch (error) {
    console.error("Error fetching timetables:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch timetables",
      error: error.message,
    });
  }
};

/**
 * @desc    Get timetable by class name
 * @route   GET /api/timetables/class/:className
 * @access  Private
 */
export const getTimetableByClass = async (req, res) => {
  try {
    const { className } = req.params;
    const { section = "A" } = req.query;

    const timetable = await Timetable.findOne({
      className,
      section,
      isActive: true,
    });

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: `No timetable found for class ${className} section ${section}`,
        data: null,
      });
    }

    res.status(200).json({
      success: true,
      data: timetable.formatForFrontend(),
    });
  } catch (error) {
    console.error("Error fetching timetable by class:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch timetable",
      error: error.message,
    });
  }
};

/**
 * @desc    Get timetable by ID
 * @route   GET /api/timetables/:id
 * @access  Private
 */
export const getTimetableById = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found",
      });
    }

    res.status(200).json({
      success: true,
      data: timetable.formatForFrontend(),
    });
  } catch (error) {
    console.error("Error fetching timetable:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch timetable",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new timetable
 * @route   POST /api/timetables
 * @access  Private (Admin only)
 */
export const createTimetable = async (req, res) => {
  try {
    console.log("=== CREATE TIMETABLE REQUEST ===");
    console.log("Request body:", JSON.stringify(req.body, null, 2));
    console.log(
      "User:",
      req.user ? { id: req.user._id, role: req.user.role } : "No user",
    );

    const {
      class: className,
      section = "A",
      subjectGroup = "General",
      periodStartTime = "08:00",
      duration = "45",
      days,
    } = req.body;

    // Validate required fields
    if (!className) {
      console.log("Validation failed: Class name is required");
      return res.status(400).json({
        success: false,
        message: "Class name is required",
      });
    }

    // Check if timetable already exists for this class-section
    const existingTimetable = await Timetable.findOne({
      className,
      section,
      isActive: true,
    });

    if (existingTimetable) {
      return res.status(400).json({
        success: false,
        message: `Timetable already exists for class ${className} section ${section}. Please edit the existing timetable.`,
      });
    }

    // Convert frontend format to backend format
    const schedule = {};
    const weekDays = [
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday",
    ];

    weekDays.forEach((day) => {
      if (days && days[day]) {
        schedule[day] = days[day].map((period) => ({
          subject: period.subject,
          teacher: period.teacher,
          timeFrom: period.timeFrom,
          timeTo: period.timeTo,
        }));
      } else {
        schedule[day] = [];
      }
    });

    // Create timetable
    const timetable = await Timetable.create({
      className,
      section,
      subjectGroup,
      periodStartTime,
      periodDuration: parseInt(duration),
      schedule,
      createdBy: req.user._id,
      updatedBy: req.user._id,
    });

    console.log("Timetable created successfully:", timetable._id);
    res.status(201).json({
      success: true,
      message: "Timetable created successfully",
      data: timetable.formatForFrontend(),
    });
  } catch (error) {
    console.error("=== ERROR CREATING TIMETABLE ===");
    console.error("Error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Timetable already exists for this class and section",
      });
    }

    // Handle validation errors
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(", "),
        error: error.message,
      });
    }

    res.status(500).json({
      success: false,
      message: "Failed to create timetable",
      error: error.message,
    });
  }
};

/**
 * @desc    Update timetable
 * @route   PUT /api/timetables/:id
 * @access  Private (Admin only)
 */
export const updateTimetable = async (req, res) => {
  try {
    const {
      class: className,
      section,
      subjectGroup,
      periodStartTime,
      duration,
      days,
    } = req.body;

    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found",
      });
    }

    // Update fields if provided
    if (className) timetable.className = className;
    if (section) timetable.section = section;
    if (subjectGroup) timetable.subjectGroup = subjectGroup;
    if (periodStartTime) timetable.periodStartTime = periodStartTime;
    if (duration) timetable.periodDuration = parseInt(duration);

    // Update schedule if days are provided
    if (days) {
      const weekDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      weekDays.forEach((day) => {
        if (days[day] !== undefined) {
          timetable.schedule[day] = days[day].map((period) => ({
            subject: period.subject,
            teacher: period.teacher,
            timeFrom: period.timeFrom,
            timeTo: period.timeTo,
          }));
        }
      });
    }

    timetable.updatedBy = req.user._id;
    await timetable.save();

    res.status(200).json({
      success: true,
      message: "Timetable updated successfully",
      data: timetable.formatForFrontend(),
    });
  } catch (error) {
    console.error("Error updating timetable:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update timetable",
      error: error.message,
    });
  }
};

/**
 * @desc    Update timetable by class name (upsert)
 * @route   PUT /api/timetables/class/:className
 * @access  Private (Admin only)
 */
export const updateTimetableByClass = async (req, res) => {
  try {
    const { className } = req.params;
    const {
      section = "A",
      subjectGroup,
      periodStartTime,
      duration,
      days,
    } = req.body;

    let timetable = await Timetable.findOne({
      className,
      section,
      isActive: true,
    });

    if (!timetable) {
      // Create new timetable if not exists
      const schedule = {};
      const weekDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      weekDays.forEach((day) => {
        if (days && days[day]) {
          schedule[day] = days[day].map((period) => ({
            subject: period.subject,
            teacher: period.teacher,
            timeFrom: period.timeFrom,
            timeTo: period.timeTo,
          }));
        } else {
          schedule[day] = [];
        }
      });

      timetable = await Timetable.create({
        className,
        section,
        subjectGroup: subjectGroup || "General",
        periodStartTime: periodStartTime || "08:00",
        periodDuration: parseInt(duration) || 45,
        schedule,
        createdBy: req.user._id,
        updatedBy: req.user._id,
      });

      return res.status(201).json({
        success: true,
        message: "Timetable created successfully",
        data: timetable.formatForFrontend(),
      });
    }

    // Update existing timetable
    if (subjectGroup) timetable.subjectGroup = subjectGroup;
    if (periodStartTime) timetable.periodStartTime = periodStartTime;
    if (duration) timetable.periodDuration = parseInt(duration);

    // Update schedule if days are provided
    if (days) {
      const weekDays = [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ];

      weekDays.forEach((day) => {
        if (days[day] !== undefined) {
          timetable.schedule[day] = days[day].map((period) => ({
            subject: period.subject,
            teacher: period.teacher,
            timeFrom: period.timeFrom,
            timeTo: period.timeTo,
          }));
        }
      });
    }

    timetable.updatedBy = req.user._id;
    await timetable.save();

    res.status(200).json({
      success: true,
      message: "Timetable updated successfully",
      data: timetable.formatForFrontend(),
    });
  } catch (error) {
    console.error("Error updating timetable by class:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update timetable",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete timetable (hard delete from MongoDB)
 * @route   DELETE /api/timetables/:id
 * @access  Private (Admin only)
 */
export const deleteTimetable = async (req, res) => {
  try {
    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found",
      });
    }

    // Hard delete - permanently remove from MongoDB
    await Timetable.findByIdAndDelete(req.params.id);

    console.log(`Timetable ${req.params.id} permanently deleted from MongoDB`);

    res.status(200).json({
      success: true,
      message: "Timetable permanently deleted from database",
    });
  } catch (error) {
    console.error("Error deleting timetable:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete timetable",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete period from a specific day
 * @route   DELETE /api/timetables/:id/period
 * @access  Private (Admin only)
 */
export const deletePeriod = async (req, res) => {
  try {
    const { day, periodIndex } = req.body;

    if (!day || periodIndex === undefined) {
      return res.status(400).json({
        success: false,
        message: "Day and period index are required",
      });
    }

    const timetable = await Timetable.findById(req.params.id);

    if (!timetable) {
      return res.status(404).json({
        success: false,
        message: "Timetable not found",
      });
    }

    if (!timetable.schedule[day]) {
      return res.status(400).json({
        success: false,
        message: `Invalid day: ${day}`,
      });
    }

    if (periodIndex < 0 || periodIndex >= timetable.schedule[day].length) {
      return res.status(400).json({
        success: false,
        message: "Invalid period index",
      });
    }

    // Remove the period
    timetable.schedule[day].splice(periodIndex, 1);
    timetable.updatedBy = req.user._id;
    await timetable.save();

    res.status(200).json({
      success: true,
      message: "Period deleted successfully",
      data: timetable.formatForFrontend(),
    });
  } catch (error) {
    console.error("Error deleting period:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete period",
      error: error.message,
    });
  }
};

/**
 * @desc    Get list of available classes
 * @route   GET /api/timetables/classes
 * @access  Private
 */
export const getAvailableClasses = async (req, res) => {
  try {
    // Get distinct class names from timetables
    const classesWithTimetables = await Timetable.distinct("className", {
      isActive: true,
    });

    // Define all possible classes (1st to 10th)
    const allClasses = [
      "1st",
      "2nd",
      "3rd",
      "4th",
      "5th",
      "6th",
      "7th",
      "8th",
      "9th",
      "10th",
      "11th",
      "12th",
    ];

    const sections = ["A", "B", "C", "D"];

    // Create class list with timetable status
    const classList = [];
    allClasses.forEach((cls) => {
      sections.forEach((section) => {
        const fullClassName = `${cls} ${section}`;
        classList.push({
          className: fullClassName,
          class: cls,
          section,
          hasTimetable: classesWithTimetables.includes(fullClassName),
        });
      });
    });

    res.status(200).json({
      success: true,
      data: {
        classes: allClasses,
        sections,
        classList,
        classesWithTimetables,
      },
    });
  } catch (error) {
    console.error("Error fetching available classes:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch available classes",
      error: error.message,
    });
  }
};

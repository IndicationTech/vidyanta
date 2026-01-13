import Student from "../models/Student.js";

/**
 * @desc    Get all students
 * @route   GET /api/students
 * @access  Private
 */
export const getAllStudents = async (req, res) => {
  try {
    const students = await Student.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Error fetching students:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch students",
      error: error.message,
    });
  }
};

/**
 * @desc    Get single student by ID
 * @route   GET /api/students/:id
 * @access  Private
 */
export const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id).select("-password");

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    res.status(200).json({
      success: true,
      data: student,
    });
  } catch (error) {
    console.error("Error fetching student:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch student",
      error: error.message,
    });
  }
};

/**
 * @desc    Create a new student
 * @route   POST /api/students
 * @access  Private
 */
export const createStudent = async (req, res) => {
  try {
    console.log("=== CREATE STUDENT REQUEST ===");
    console.log("Request body:", req.body);

    const {
      name,
      email,
      password,
      class: studentClass,
      section,
      roll,
      parent,
    } = req.body;

    console.log("Extracted data:", {
      name,
      email,
      password: password ? "***" : undefined,
      studentClass,
      section,
      roll,
      parent,
    });

    // Validate required fields
    if (!name || !studentClass || !password) {
      console.log("Validation failed - missing required fields");
      return res.status(400).json({
        success: false,
        message: "Name, class, and password are required",
      });
    }

    // Check if email already exists (if provided)
    if (email) {
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        console.log("Email already exists:", email);
        return res.status(400).json({
          success: false,
          message: "A student with this email already exists",
        });
      }
    }

    console.log("Creating student in database...");
    // Create student
    const student = await Student.create({
      name,
      email,
      password,
      class: studentClass,
      section: section || "A",
      roll,
      parent,
      status: "Active",
    });

    console.log("Student created successfully:", student._id);

    // Return student without password
    const studentData = await Student.findById(student._id).select("-password");

    console.log("Sending success response");
    res.status(201).json({
      success: true,
      message: "Student created successfully",
      data: studentData,
    });
  } catch (error) {
    console.error("=== ERROR CREATING STUDENT ===");
    console.error("Error:", error);
    console.error("Error message:", error.message);
    console.error("Error stack:", error.stack);
    res.status(500).json({
      success: false,
      message: "Failed to create student",
      error: error.message,
    });
  }
};

/**
 * @desc    Create multiple students (bulk upload)
 * @route   POST /api/students/bulk
 * @access  Private
 */
export const createBulkStudents = async (req, res) => {
  try {
    const { students } = req.body;

    if (!students || !Array.isArray(students) || students.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Please provide an array of students",
      });
    }

    const results = {
      success: [],
      failed: [],
    };

    for (const studentData of students) {
      try {
        const {
          name,
          email,
          password,
          class: studentClass,
          section,
          roll,
          parent,
        } = studentData;

        // Validate required fields
        if (!name || !studentClass) {
          results.failed.push({
            data: studentData,
            reason: "Name and class are required",
          });
          continue;
        }

        // Check if email already exists
        if (email) {
          const existingStudent = await Student.findOne({ email });
          if (existingStudent) {
            results.failed.push({
              data: studentData,
              reason: "Email already exists",
            });
            continue;
          }
        }

        // Create student
        const student = await Student.create({
          name,
          email,
          password: password || "password123",
          class: studentClass,
          section: section || "A",
          roll,
          parent,
          status: "Active",
        });

        results.success.push(student._id);
      } catch (error) {
        results.failed.push({
          data: studentData,
          reason: error.message,
        });
      }
    }

    res.status(201).json({
      success: true,
      message: `Bulk upload completed: ${results.success.length} successful, ${results.failed.length} failed`,
      data: {
        successCount: results.success.length,
        failedCount: results.failed.length,
        successIds: results.success,
        failedEntries: results.failed,
      },
    });
  } catch (error) {
    console.error("Error in bulk student creation:", error);
    res.status(500).json({
      success: false,
      message: "Failed to process bulk upload",
      error: error.message,
    });
  }
};

/**
 * @desc    Update student
 * @route   PUT /api/students/:id
 * @access  Private
 */
export const updateStudent = async (req, res) => {
  try {
    const {
      name,
      email,
      class: studentClass,
      section,
      roll,
      parent,
      status,
    } = req.body;

    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    // Check if email is being changed and if it already exists
    if (email && email !== student.email) {
      const existingStudent = await Student.findOne({ email });
      if (existingStudent) {
        return res.status(400).json({
          success: false,
          message: "A student with this email already exists",
        });
      }
    }

    // Update fields
    if (name) student.name = name;
    if (email) student.email = email;
    if (studentClass) student.class = studentClass;
    if (section) student.section = section;
    if (roll !== undefined) student.roll = roll;
    if (parent) student.parent = parent;
    if (status) student.status = status;

    await student.save();

    const updatedStudent = await Student.findById(student._id).select(
      "-password"
    );

    res.status(200).json({
      success: true,
      message: "Student updated successfully",
      data: updatedStudent,
    });
  } catch (error) {
    console.error("Error updating student:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update student",
      error: error.message,
    });
  }
};

/**
 * @desc    Delete student
 * @route   DELETE /api/students/:id
 * @access  Private
 */
export const deleteStudent = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);

    if (!student) {
      return res.status(404).json({
        success: false,
        message: "Student not found",
      });
    }

    await Student.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting student:", error);
    res.status(500).json({
      success: false,
      message: "Failed to delete student",
      error: error.message,
    });
  }
};

/**
 * @desc    Search students by name, class, or parent
 * @route   GET /api/students/search
 * @access  Private
 */
export const searchStudents = async (req, res) => {
  try {
    const { query, class: studentClass, section, status } = req.query;

    let searchCriteria = {};

    if (query) {
      searchCriteria.$or = [
        { name: { $regex: query, $options: "i" } },
        { parent: { $regex: query, $options: "i" } },
        { email: { $regex: query, $options: "i" } },
      ];
    }

    if (studentClass) {
      searchCriteria.class = studentClass;
    }

    if (section) {
      searchCriteria.section = section;
    }

    if (status) {
      searchCriteria.status = status;
    }

    const students = await Student.find(searchCriteria)
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: students.length,
      data: students,
    });
  } catch (error) {
    console.error("Error searching students:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search students",
      error: error.message,
    });
  }
};

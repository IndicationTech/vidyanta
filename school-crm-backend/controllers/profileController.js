import mongoose from "mongoose";
import User from "../models/User.js";

// Create a teacher/user profile
export const createProfile = async (req, res) => {
  try {
    const {
      email,
      password,
      firstName,
      lastName,
      teacherId,
      name,
      role,
      ...rest
    } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        message: "firstName, lastName, email, and password are required",
      });
    }

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: "Email already exists" });
    }

    // Determine the role - default to TEACHER if not provided or if it's TEACHER
    const userRole = role && role !== "TEACHER" ? role : "TEACHER";

    // Only generate teacherId for TEACHER role
    const generatedTeacherId =
      userRole === "TEACHER"
        ? teacherId || `TCH${Math.floor(1000 + Math.random() * 9000)}`
        : undefined;

    const userData = {
      email: email.toLowerCase(),
      password, // Will be hashed by the User model's pre-save hook
      firstName,
      lastName,
      name: name || `${firstName} ${lastName}`.trim(),
      role: userRole,
      status: "Active",
      ...rest,
    };

    // Only add teacherId for TEACHER role
    if (userRole === "TEACHER" && generatedTeacherId) {
      userData.teacherId = generatedTeacherId;
    }

    const user = new User(userData);

    const savedUser = await user.save();
    // Convert Mongoose document to plain object to avoid serialization issues
    const userObject = savedUser.toObject ? savedUser.toObject() : savedUser;
    // Don't send password back to client
    delete userObject.password;

    return res.status(201).json(userObject);
  } catch (error) {
    console.error("❌ Error creating teacher:", error.message);
    console.error("Stack:", error.stack);
    return res.status(500).json({ message: error.message });
  }
};

// Get all staff members (TEACHER, PARENT, ACCOUNTS_HR)
export const getAllStaff = async (req, res) => {
  try {
    const staff = await User.find({
      role: { $in: ["TEACHER", "PARENT", "ACCOUNTS_HR"] },
    }).select("-password");
    res.json(staff);
  } catch (error) {
    console.error("❌ Error fetching staff:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const getProfile = async (req, res) => {
  try {
    const id = req.params.id || (req.user && req.user.id);

    if (!id && req.path.includes("teacher/profile")) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    let user = null;
    if (id && mongoose.isValidObjectId(id)) {
      user = await User.findById(id);
    }

    if (!user && id) {
      user = await User.findOne({ teacherId: id });
    }

    if (!user) {
      // List all users to debug
      const allUsers = await User.find({}).select("_id teacherId name email");

      return res.status(404).json({ message: "User not found" });
    }

    // Convert Mongoose document to plain object to avoid serialization issues
    const userObject = user.toObject ? user.toObject() : user;
    delete userObject.password; // Don't send password to client

    res.json(userObject);
  } catch (error) {
    console.error("❌ Error in getProfile:", error.message);
    res.status(500).json({ message: error.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // If teacher is updating their own profile, restrict fields
    if (user.role === "Teacher") {
      const allowedFields = [
        "photo",
        "phone",
        "email",
        "address",
        "permanentAddress",
        "languages",
        "password",
      ];
      const updates = {};
      allowedFields.forEach((field) => {
        if (req.body[field] !== undefined) {
          updates[field] = req.body[field];
        }
      });

      const updated = await User.findByIdAndUpdate(req.params.id, updates, {
        new: true,
      });
      const updatedObject = updated.toObject ? updated.toObject() : updated;
      return res.json(updatedObject);
    }

    // Admin can update everything
    const updated = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    const updatedObject = updated.toObject ? updated.toObject() : updated;
    res.json(updatedObject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const uploadPhoto = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      console.error("❌ User not found:", req.params.id);
      return res.status(404).json({ message: "User not found" });
    }

    if (!req.file) {
      console.error("❌ No file in request");
      return res.status(400).json({ message: "No file uploaded" });
    }

    // For local storage, req.file.filename will contain the name
    // We construct a URL that matches what server.js serves
    const photoUrl = req.file ? `/uploads/profiles/${req.file.filename}` : null;

    if (!photoUrl) {
      console.error("❌ No photo URL generated");
      return res.status(500).json({
        message: "Failed to process uploaded photo",
      });
    }
    user.photo = photoUrl;
    const savedUser = await user.save();

    // Convert to plain object before sending
    const userObject = savedUser.toObject ? savedUser.toObject() : savedUser;
    res.json({
      message: "Photo uploaded successfully",
      photo: userObject.photo,
    });
  } catch (error) {
    console.error("❌ Error uploading photo:", error);
    console.error("Stack:", error.stack);
    res.status(500).json({
      message: error.message || "Internal server error",
      error: process.env.NODE_ENV === "development" ? error.stack : undefined,
    });
  }
};

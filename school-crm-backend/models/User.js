import mongoose from "mongoose";
import bcryptjs from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // Personal Information
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    firstName: {
      type: String,
      trim: true,
    },
    lastName: {
      type: String,
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters long"],
    },
    role: {
      type: String,
      required: [true, "Role is required"],
      enum: {
        values: [
          "SUPER_ADMIN",
          "SCHOOL_ADMIN",
          "TEACHER",
          "STUDENT",
          "PARENT",
          "ACCOUNTS_HR",
        ],
        message: "{VALUE} is not a valid role",
      },
      default: "STUDENT",
    },
    status: {
      type: String,
      enum: ["Active", "Inactive", "Suspended"],
      default: "Active",
    },
    // Additional fields for teacher profiles (set by admin)
    teacherId: {
      type: String,
      sparse: true, // Allows null values without unique constraint violations
      unique: true, // Ensures teacherId is unique when present
    },
    // Personal Information
    phone: String,
    address: String,
    permanentAddress: String,
    dob: Date,
    dateOfBirth: Date,
    dateOfJoining: Date,
    joiningDate: Date,
    gender: String,
    bloodGroup: String,
    maritalStatus: String,
    fatherName: String,
    motherName: String,
    panNumber: String,

    // Professional Information
    subject: String,
    department: String,
    qualification: String,
    experience: String,
    classAssigned: String,
    section: String, // Sections assigned to teacher (comma-separated like "A, B, C")
    previousSchool: String,

    // Photos
    profilePhoto: String,
    photo: String, // Profile photo URL

    // Payroll Information
    basicSalary: Number,
    epfNumber: String,
    contractType: String,
    workShift: String,
    workLocation: String,
    dateOfLeaving: Date,

    // Leave Balances
    medicalLeaves: Number,
    casualLeaves: Number,
    sickLeaves: Number,
    maternityLeaves: Number,

    // Bank Information
    accountName: String,
    accountNumber: String,
    bankName: String,
    ifscCode: String,
    branchName: String,

    // Other
    languages: [String],

    // Last login tracking
    lastLogin: Date,
  },
  {
    timestamps: true, // Adds createdAt and updatedAt
  },
);

// Hash password before saving
userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcryptjs.compare(candidatePassword, this.password);
};

// Update last login
userSchema.methods.updateLastLogin = async function () {
  this.lastLogin = new Date();
  await this.save({ validateBeforeSave: false });
};

export default mongoose.model("User", userSchema);

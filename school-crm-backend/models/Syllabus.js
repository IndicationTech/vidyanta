import mongoose from "mongoose";

const topicSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  status: {
    type: String,
    enum: ["pending", "in-progress", "completed"],
    default: "pending",
  },
  progress: { type: Number, default: 0, min: 0, max: 100 },
  date: { type: String, required: true },
  materials: [
    {
      type: { type: String, enum: ["pdf", "ppt", "video", "youtube"] },
      name: { type: String },
      url: { type: String },
    },
  ],
  homework: { type: String, default: "Not assigned" },
  keyPoints: [{ type: String }],
});

const subjectSchema = new mongoose.Schema({
  id: { type: String, required: true },
  name: { type: String, required: true },
  topics: [topicSchema],
});

const syllabusSchema = new mongoose.Schema(
  {
    schoolId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    standard: { type: String, required: true },
    subject: { type: String, required: true },
    semester: { type: Number, required: true, enum: [1, 2] },
    section: [{ type: String }], // Array of sections like ["A", "B", "C", "D"]
    syllabusData: subjectSchema,
    assignedTeachers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

// Create compound index for unique syllabus per school/standard/subject/semester
syllabusSchema.index(
  { schoolId: 1, standard: 1, subject: 1, semester: 1 },
  { unique: true },
);

const Syllabus = mongoose.model("Syllabus", syllabusSchema);

export default Syllabus;

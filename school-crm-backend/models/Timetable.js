import mongoose from "mongoose";

// Period schema for individual class periods
const periodSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, "Subject is required"],
    trim: true,
  },
  teacher: {
    type: String,
    trim: true,
    default: "", // Teacher is optional for breaks
  },
  timeFrom: {
    type: String,
    required: [true, "Start time is required"],
  },
  timeTo: {
    type: String,
    required: [true, "End time is required"],
  },
});

// Day schedule schema
const dayScheduleSchema = new mongoose.Schema({
  day: {
    type: String,
    required: true,
    enum: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
  },
  periods: [periodSchema],
});

// Main timetable schema
const timetableSchema = new mongoose.Schema(
  {
    className: {
      type: String,
      required: [true, "Class name is required"],
      trim: true,
    },
    section: {
      type: String,
      default: "A",
      trim: true,
    },
    subjectGroup: {
      type: String,
      enum: ["Science", "Commerce", "Arts", "General"],
      default: "General",
    },
    periodStartTime: {
      type: String,
      default: "08:00",
    },
    periodDuration: {
      type: Number,
      default: 45, // in minutes
    },
    schedule: {
      Monday: [periodSchema],
      Tuesday: [periodSchema],
      Wednesday: [periodSchema],
      Thursday: [periodSchema],
      Friday: [periodSchema],
      Saturday: [periodSchema],
    },
    academicYear: {
      type: String,
      default: () => {
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        // Academic year typically starts in April/June
        if (month >= 3) {
          return `${year}-${year + 1}`;
        }
        return `${year - 1}-${year}`;
      },
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    updatedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  },
);

// Create compound index for unique class-section-academicYear combination
timetableSchema.index(
  { className: 1, section: 1, academicYear: 1 },
  { unique: true },
);

// Static method to get timetable by class
timetableSchema.statics.getByClass = async function (className, section = "A") {
  return this.findOne({
    className,
    section,
    isActive: true,
  });
};

// Static method to get all active timetables
timetableSchema.statics.getAllActive = async function () {
  return this.find({ isActive: true }).sort({ className: 1, section: 1 });
};

// Instance method to format schedule for frontend
timetableSchema.methods.formatForFrontend = function () {
  const formatted = {
    _id: this._id,
    class: this.className,
    section: this.section,
    subjectGroup: this.subjectGroup,
    periodStartTime: this.periodStartTime,
    duration: this.periodDuration.toString(),
    days: {},
  };

  // Format each day's schedule
  const days = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];
  days.forEach((day) => {
    formatted.days[day] = (this.schedule[day] || []).map((period, index) => ({
      id: `${day}-${index}`,
      subject: period.subject,
      teacher: period.teacher,
      timeFrom: period.timeFrom,
      timeTo: period.timeTo,
    }));
  });

  return formatted;
};

export default mongoose.model("Timetable", timetableSchema);

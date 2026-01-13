import mongoose from "mongoose";

const LeadSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    source: String,
    status: {
      type: String,
      enum: ["New", "Contacted", "Visit Scheduled", "Enrolled"],
      default: "New",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Lead", LeadSchema);

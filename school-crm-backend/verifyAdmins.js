import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/school-erp";

const verifyAdmins = async () => {
  try {
    await mongoose.connect(MONGODB_URI);

    const admins = await User.find({
      role: { $in: ["SUPER_ADMIN", "SCHOOL_ADMIN"] },
    }).select("name email role status");

    admins.forEach((admin, index) => {
      console.log(`${index + 1}. ${admin.name}`);
      console.log(`   Email: ${admin.email}`);
      console.log(`   Role: ${admin.role}`);
      console.log(`   Status: ${admin.status}`);
      console.log("");
    });
    process.exit(0);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
};

verifyAdmins();

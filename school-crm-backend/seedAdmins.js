import mongoose from "mongoose";
import User from "./models/User.js";
import dotenv from "dotenv";

dotenv.config();

const MONGODB_URI =
  process.env.MONGODB_URI || "mongodb://localhost:27017/school-erp";

const seedAdmins = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(MONGODB_URI);
    console.log("📦 Connected to MongoDB");

    // Check if admins already exist
    const superAdminExists = await User.findOne({
      email: "admin@gmail.com",
    });
    const schoolAdminExists = await User.findOne({
      email: "schooladmin@gmail.com",
    });

    if (superAdminExists && schoolAdminExists) {
      console.log("✅ Default admin accounts already exist!");
      console.log("   - Super Admin: admin@gmail.com");
      console.log("   - School Admin: schooladmin@gmail.com");
      process.exit(0);
    }

    // Create Super Admin if doesn't exist
    if (!superAdminExists) {
      const superAdmin = new User({
        name: "Super Administrator",
        firstName: "Super",
        lastName: "Administrator",
        email: "admin@gmail.com",
        password: "password123", // Will be hashed automatically
        role: "SUPER_ADMIN",
        status: "Active",
      });
      await superAdmin.save();
      console.log("✅ Super Admin created:");
      console.log("   Email: admin@gmail.com");
      console.log("   Password: password123");
    } else {
      console.log("⚠️  Super Admin already exists");
    }

    // Create School Admin if doesn't exist
    if (!schoolAdminExists) {
      const schoolAdmin = new User({
        name: "School Administrator",
        firstName: "School",
        lastName: "Administrator",
        email: "schooladmin@gmail.com",
        password: "password123", // Will be hashed automatically
        role: "SCHOOL_ADMIN",
        status: "Active",
      });
      await schoolAdmin.save();
      console.log("✅ School Admin created:");
      console.log("   Email: schooladmin@gmail.com");
      console.log("   Password: password123");
    } else {
      console.log("⚠️  School Admin already exists");
    }

    console.log("\n🎉 Admin seeding completed successfully!");
    console.log("\nYou can now login with:");
    console.log("1. Super Admin: admin@gmail.com / password123");
    console.log("2. School Admin: schooladmin@gmail.com / password123");

    process.exit(0);
  } catch (error) {
    console.error("❌ Error seeding admins:", error);
    process.exit(1);
  }
};

seedAdmins();

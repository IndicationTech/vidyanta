import mongoose from "mongoose";

const connectDB = async () => {
  try {
    console.log("Connecting to MongoDB...");
    await mongoose.connect(
      "mongodb+srv://bhumikasutar21:iYOs2E2zZdW7WPJc@clusterone.chtgg.mongodb.net/school_crm"
    );
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection failed ❌");
    console.error(error.message);
  }
};

export default connectDB;

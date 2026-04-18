import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const mongoUri = process.env.MONGO_URI || "";

export const connectDB = async () => {
  try {
    await mongoose.connect(mongoUri);
    console.log("Database connected");
  } catch (error) {
    console.log("Database connection error:", error);
  }
};

// const mongoUri = process.env.MONGO_URI || "";
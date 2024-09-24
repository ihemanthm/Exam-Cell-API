import mongoose from "mongoose";
import { MONGODB_URI } from "./serverConfig";

const mongoURI: string = "mongodb://localhost:27017";

export const connectToMongo = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI || mongoURI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

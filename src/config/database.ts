import mongoose from "mongoose";
import { MONGODB_URI } from "./serverConfig";

export const connectToMongo = async (): Promise<void> => {

  try {
    await mongoose.connect(MONGODB_URI as string);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

import mongoose from "mongoose";
import { MONGODB_URI } from "./serverConfig";

//mondoDB connection URI
const mongoURI: string = "mongodb://localhost:27017";

//setup connection to mongodb
export const connectToMongo = async (): Promise<void> => {
  try {
    await mongoose.connect(MONGODB_URI || mongoURI);
    console.log("MongoDB connected");
  } catch (err) {
    console.error("MongoDB connection error:", err);
  }
};

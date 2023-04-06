import mongoose from "mongoose";
import dotenv from "dotenv";
import seedData from "./Seed";
dotenv.config();

const MONGODB_URI: string = process.env.MONGODB_URI!;
const MONGODB_URI_SERVER: string = process.env.MONGODB_URI_SERVER!;
let env: string = process.env.NODE_ENV || "development";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

async function dbConnect() {
  try {
    await mongoose.connect("mongodb://localhost:27017/SalarDb");
    console.log("Connected to MongoDB");
    await seedData(); // call seedData function
  } catch (error) {
    console.log("Error connecting to MongoDB", error);
  }
}

export default dbConnect;

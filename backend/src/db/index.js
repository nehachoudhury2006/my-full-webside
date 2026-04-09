import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

let dbReady = false;

const connectDB = async () => {
  const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
    dbName: DB_NAME,
  });

  dbReady = true;

  console.log(
    `MongoDB connected. Host: ${connectionInstance.connection.host}, DB: ${connectionInstance.connection.name}`
  );

  return connectionInstance;
};

mongoose.connection.on("disconnected", () => {
  dbReady = false;
  console.warn("MongoDB disconnected");
});

mongoose.connection.on("error", (error) => {
  dbReady = false;
  console.error("MongoDB connection error:", error.message);
});

const isDbReady = () => dbReady;

export { isDbReady };
export default connectDB;

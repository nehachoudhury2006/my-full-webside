import mongoose from "mongoose";
import { DB_NAME } from "../constant.js";

const connectDB = async () => {
  const connectionInstance = await mongoose.connect(process.env.MONGODB_URI, {
    dbName: DB_NAME,
  });

  console.log(
    `MongoDB connected. Host: ${connectionInstance.connection.host}, DB: ${connectionInstance.connection.name}`
  );

  return connectionInstance;
};

export default connectDB;

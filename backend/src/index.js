import dotenv from "dotenv";
import mongoose from "mongoose";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

(async () => {
  try {
    await connectDB();

    app.on("error", (error) => {
      console.log("ERROR:", error);
      throw error;
    });

    app.listen(process.env.PORT || 8001, () => {
      console.log(`Server is listening on port ${process.env.PORT || 8001}`);
    });
  } catch (error) {
    console.error("ERROR:", error);
    process.exit(1);
  }
})();

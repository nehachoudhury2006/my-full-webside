import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORT || 8001;
let dbRetryTimer = null;

const scheduleDbReconnect = () => {
  if (dbRetryTimer) {
    return;
  }

  dbRetryTimer = setTimeout(async () => {
    dbRetryTimer = null;
    try {
      await connectDB();
    } catch (error) {
      console.error("MongoDB retry failed:", error.message);
      scheduleDbReconnect();
    }
  }, 5000);
};

app.on("error", (error) => {
  console.log("ERROR:", error);
  throw error;
});

app.listen(port, async () => {
  console.log(`Server is listening on port ${port}`);

  try {
    await connectDB();
  } catch (error) {
    console.error("Initial MongoDB connection failed:", error.message);
    scheduleDbReconnect();
  }
});

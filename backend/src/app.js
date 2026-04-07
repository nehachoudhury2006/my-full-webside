// import express from "express";
// import cookieParser from "cookie-parser";
// import cors from "cors";

// import { ApiError } from "./utils/apierror.js";

// const app = express();

// const corsOrigin = process.env.CORS_ORIGIN?.trim() || "*";

// // app.use(
// //   cors({
// //     origin: corsOrigin === "*" ? true : corsOrigin,
// //     credentials: corsOrigin !== "*",
// //   })
// // );
// app.use(cors({
//     origin: "*",
//     methods: ["GET", "POST", "PUT", "DELETE"],
//     allowedHeaders: ["Content-Type"]
// }));
// app.use(cors({
//     origin: "*",
// }));
// app.use(express.json({ limit: "16kb" }));
// app.use(express.urlencoded({ extended: true, limit: "16kb" }));
// app.use(cookieParser());

// app.get("/api/v1/health", (_req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "API is running",
//   });
// });

// app.get("/api/v2/health", (_req, res) => {
//   res.status(200).json({
//     success: true,
//     message: "API is running",
//   });
// });

// import router from "./routes/user.routes.js";
// app.use("/api/v1/users", router);
// app.use("/api/v1/user", router);
// app.use("/api/v2/users", router);
// app.use("/api/v2/user", router);

// app.use((_req, _res, next) => {
//   next(new ApiError(404, "Route not found"));
// });

// app.use((error, _req, res, _next) => {
//   const statusCode = error.statusCode || 500;

//   res.status(statusCode).json({
//     success: false,
//     message: error.message || "Internal server error",
//     errors: error.errors || [],
//   });
// });

// export { app };
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";

import { ApiError } from "./utils/apierror.js";
import userRouter from "./routes/user.routes.js";
import appointmentRouter from "./routes/appointment.routes.js";
import { loginUser, registerUser } from "./controllers/user.controller.js";
import {
  createAppointment,
  deleteAppointmentsByCategory,
  getAppointments,
} from "./controllers/appointment.controller.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const frontendPath = path.resolve(__dirname, "../../frontend");

app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,PATCH,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Headers", "Content-Type, Authorization");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204);
  }

  next();
});
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    optionsSuccessStatus: 204,
  })
);

// ✅ Middlewares
app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(cookieParser());

// ✅ Health check
app.get("/api/v1/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use(express.static(frontendPath));

// ✅ Routes
app.post("/api/v1/users/register", registerUser);
app.post("/api/v1/users/login", loginUser);
app.post("/api/v1/user/register", registerUser);
app.post("/api/v1/user/login", loginUser);
app.post("/api/users/register", registerUser);
app.post("/api/users/login", loginUser);
app.post("/users/register", registerUser);
app.post("/users/login", loginUser);
app.post("/register", registerUser);
app.post("/login", loginUser);
app.get("/api/v1/appointments", getAppointments);
app.post("/api/v1/appointments", createAppointment);
app.delete("/api/v1/appointments", deleteAppointmentsByCategory);
app.get("/api/appointments", getAppointments);
app.post("/api/appointments", createAppointment);
app.delete("/api/appointments", deleteAppointmentsByCategory);

app.use("/api/v1/users", userRouter);
app.use("/api/v1/user", userRouter);
app.use("/api/users", userRouter);
app.use("/users", userRouter);
app.use("/", userRouter);
app.use("/api/v1/appointments", appointmentRouter);
app.use("/api/appointments", appointmentRouter);

// ❌ REMOVE these (not needed)
// app.use("/api/v1/user", router);
// app.use("/api/v2/users", router);
// app.use("/api/v2/user", router);

// ✅ 404 handler
app.use((_req, _res, next) => {
  next(new ApiError(404, "Route not found"));
});

// ✅ Error handler
app.use((error, _req, res, _next) => {
  const statusCode = error.statusCode || 500;

  res.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
    errors: error.errors || [],
  });
});

export { app };

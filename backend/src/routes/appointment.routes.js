import { Router } from "express";
import {
  createAppointment,
  deleteAppointmentsByCategory,
  getAppointments,
} from "../controllers/appointment.controller.js";

const router = Router();

router.get("/", getAppointments);
router.post("/", createAppointment);
router.delete("/", deleteAppointmentsByCategory);

export default router;

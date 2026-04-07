import { Router } from "express";
import { registerUser, loginUser } from "../controllers/user.controller.js";
const router =  Router();

// router.route("/register").post(registerUser)

router.post("/register", registerUser);

router.post("/login", loginUser);
export default router;
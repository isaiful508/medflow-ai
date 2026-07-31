import { Router } from "express";
import authRouter from "../modules/auth/auth.route";
import doctorRouter from "../modules/doctor/doctor.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/doctors", doctorRouter);

export default router;

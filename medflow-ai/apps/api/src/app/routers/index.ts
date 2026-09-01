import { Router } from "express";
import authRouter from "../modules/auth/auth.route";
import doctorRouter from "../modules/doctor/doctor.route";
import patientRouter from "../modules/patient/patient.route";

const router = Router();

router.use("/auth", authRouter);
router.use("/doctors", doctorRouter);
router.use("/patients", patientRouter);

export default router;

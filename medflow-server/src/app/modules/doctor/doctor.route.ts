import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.get("/", DoctorController.getDoctors);
router.post("/", DoctorController.createDoctor);

export default router;

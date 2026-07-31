import { Router } from "express";
import { DoctorController } from "./doctor.controller";

const router = Router();

router.post("/", DoctorController.createDoctor);

export default router;

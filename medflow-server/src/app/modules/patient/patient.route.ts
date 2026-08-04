import { Router } from "express";
import { PatientController } from "./patient.controller";

const router = Router();

router.get("/", PatientController.getPatients);
router.post("/", PatientController.createPatient);

export default router;

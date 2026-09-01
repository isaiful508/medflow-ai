import { NextFunction, Request, Response } from "express";
import { createPatientValidationSchema } from "./patient.validation";
import { PatientService } from "./patient.service";

const createPatient = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createPatientValidationSchema.parse(req.body);
    const result = await PatientService.createPatient(validatedData);

    res.status(201).json({
      success: true,
      message: "Patient created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getPatients = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const patients = await PatientService.getAllPatients();

    res.status(200).json({
      success: true,
      message: "Patients retrieved successfully",
      data: { patients },
    });
  } catch (error) {
    next(error);
  }
};

export const PatientController = {
  createPatient,
  getPatients,
};

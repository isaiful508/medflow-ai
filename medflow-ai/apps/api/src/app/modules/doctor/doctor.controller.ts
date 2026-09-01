import { NextFunction, Request, Response } from "express";
import { createDoctorValidationSchema } from "./doctor.validation";
import { DoctorService } from "./doctor.service";

const createDoctor = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = createDoctorValidationSchema.parse(req.body);
    const result = await DoctorService.createDoctor(validatedData);

    res.status(201).json({
      success: true,
      message: "Doctor created successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const getDoctors = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const doctors = await DoctorService.getAllDoctors();

    res.status(200).json({
      success: true,
      message: "Doctors retrieved successfully",
      data: { doctors },
    });
  } catch (error) {
    next(error);
  }
};

export const DoctorController = {
  createDoctor,
  getDoctors,
};

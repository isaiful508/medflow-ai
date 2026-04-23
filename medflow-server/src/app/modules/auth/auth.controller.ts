import { NextFunction, Request, Response } from "express";
import { registerValidationSchema, loginValidationSchema } from "./auth.validation";
import { AuthService } from "./auth.service";

const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = registerValidationSchema.parse(req.body);
    const result = await AuthService.registerUser(validatedData);

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const validatedData = loginValidationSchema.parse(req.body);
    const result = await AuthService.loginUser(validatedData);

    res.status(200).json({
      success: true,
      message: "User logged in successfully",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  register,
  login,
};

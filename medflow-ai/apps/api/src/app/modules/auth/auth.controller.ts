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

const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "Refresh token is required" });
    }

    const result = await AuthService.refreshAuth(refreshToken);

    res.status(200).json({ success: true, message: "Token refreshed", data: result });
  } catch (error) {
    next(error);
  }
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: "Refresh token is required" });
    }

    await AuthService.logout(refreshToken);

    res.status(200).json({ success: true, message: "Logged out" });
  } catch (error) {
    next(error);
  }
};

export const AuthController = {
  register,
  login,
  refresh,
  logout,
};

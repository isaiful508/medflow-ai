import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import httpStatus from "http-status";
import config from "../config";
import AppError from "../errors/AppError";
import { TJwtPayload } from "../modules/auth/auth.interface";

export type AuthenticatedRequest = Request & {
  user?: TJwtPayload;
};

const auth = (req: AuthenticatedRequest, _res: Response, next: NextFunction) => {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith("Bearer ")) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Unauthorized access");
    }

    const token = authorization.split(" ")[1];

    if (!config.jwt_secret) {
      throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "JWT secret is missing");
    }

    const decoded = jwt.verify(token, config.jwt_secret) as TJwtPayload;
    req.user = decoded;

    next();
  } catch {
    next(new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired token"));
  }
};

export default auth;

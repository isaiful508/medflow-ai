import { Model } from "mongoose";
import { TUserRole } from "../auth/auth.interface";

export type TUser = {
  userId?: number;
  fullName: string;
  email: string;
  password: string;
  refreshToken?: string;
  mobile: string;
  role: TUserRole;
  termsAccepted: boolean;
};

export type UserModel = Model<TUser>;

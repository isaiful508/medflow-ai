import bcrypt from "bcrypt";
import jwt, { SignOptions } from "jsonwebtoken";
import httpStatus from "http-status";
import config from "../../config";
import AppError from "../../errors/AppError";
import { getNextSequenceValue } from "../counter/counter.utils";
import User from "../user/user.model";
import { TJwtPayload, TLoginUser, TRegisterUser } from "./auth.interface";

const signAccessToken = (payload: TJwtPayload) => {
  const secret = config.jwt_secret;

  if (!secret) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "JWT secret is missing");
  }

  const jwtOptions: SignOptions = {
    expiresIn: config.jwt_expires_in as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, jwtOptions);
};

const ensureUserCustomId = async (user: InstanceType<typeof User>) => {
  if (user.userId) {
    return user.userId;
  }

  const nextUserId = await getNextSequenceValue("userId");
  user.userId = nextUserId;
  await user.save();

  return nextUserId;
};

const registerUser = async (payload: TRegisterUser) => {
  const existingUser = await User.findOne({ email: payload.email });

  if (existingUser) {
    throw new AppError(httpStatus.CONFLICT, "User already exists with this email");
  }

  const hashedPassword = await bcrypt.hash(
    payload.password,
    config.bcrypt_salt_rounds
  );
  const nextUserId = await getNextSequenceValue("userId");

  const user = await User.create({
    userId: nextUserId,
    fullName: payload.fullName,
    email: payload.email,
    password: hashedPassword,
    mobile: payload.mobile,
    role: payload.role,
    termsAccepted: payload.terms ?? false,
  });

  const token = signAccessToken({
    userId: nextUserId,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: nextUserId,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    },
  };
};

const loginUser = async (payload: TLoginUser) => {
  const user = await User.findOne({ email: payload.email }).select("+password");

  if (!user) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const isPasswordMatched = await bcrypt.compare(payload.password, user.password);

  if (!isPasswordMatched) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid email or password");
  }

  const customUserId = await ensureUserCustomId(user);

  const token = signAccessToken({
    userId: customUserId,
    email: user.email,
    role: user.role,
  });

  return {
    token,
    user: {
      id: customUserId,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    },
  };
};

export const AuthService = {
  registerUser,
  loginUser,
};

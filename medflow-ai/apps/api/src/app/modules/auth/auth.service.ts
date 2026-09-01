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

const signRefreshToken = (payload: TJwtPayload) => {
  const secret = config.jwt_refresh_secret;

  if (!secret) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "JWT refresh secret is missing");
  }

  const jwtOptions: SignOptions = {
    expiresIn: config.jwt_refresh_expires_in as SignOptions["expiresIn"],
  };

  return jwt.sign(payload, secret, jwtOptions);
};

const verifyRefreshToken = (token: string) => {
  const secret = config.jwt_refresh_secret;

  if (!secret) {
    throw new AppError(httpStatus.INTERNAL_SERVER_ERROR, "JWT refresh secret is missing");
  }

  return jwt.verify(token, secret) as TJwtPayload;
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

  const refreshToken = signRefreshToken({
    userId: nextUserId,
    email: user.email,
    role: user.role,
  });

  // store refresh token
  user.refreshToken = refreshToken;
  await user.save();

  return {
    token,
    refreshToken,
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

  const refreshToken = signRefreshToken({
    userId: customUserId,
    email: user.email,
    role: user.role,
  });

  // persist refresh token
  user.refreshToken = refreshToken;
  await user.save();

  return {
    token,
    refreshToken,
    user: {
      id: customUserId,
      fullName: user.fullName,
      email: user.email,
      mobile: user.mobile,
      role: user.role,
    },
  };
};

const refreshAuth = async (refreshToken: string) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findOne({ userId: decoded.userId }).select(
      "+refreshToken"
    );

    if (!user || !user.refreshToken) {
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
    }

    if (user.refreshToken !== refreshToken) {
      // token mismatch — possible rotation/revocation
      throw new AppError(httpStatus.UNAUTHORIZED, "Invalid refresh token");
    }

    const newAccessToken = signAccessToken({
      userId: user.userId as number,
      email: user.email,
      role: user.role,
    });

    const newRefreshToken = signRefreshToken({
      userId: user.userId as number,
      email: user.email,
      role: user.role,
    });

    user.refreshToken = newRefreshToken;
    await user.save();

    return {
      token: newAccessToken,
      refreshToken: newRefreshToken,
    };
  } catch (err) {
    throw new AppError(httpStatus.UNAUTHORIZED, "Invalid or expired refresh token");
  }
};

const logout = async (refreshToken: string) => {
  try {
    const decoded = verifyRefreshToken(refreshToken);

    const user = await User.findOne({ userId: decoded.userId }).select(
      "+refreshToken"
    );

    if (!user) return;

    user.refreshToken = undefined as any;
    await user.save();
  } catch {
    // ignore errors during logout
  }
};

export const AuthService = {
  registerUser,
  loginUser,
  refreshAuth,
  logout,
};

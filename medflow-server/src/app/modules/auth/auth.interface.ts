export type TJwtPayload = {
  userId: number;
  email: string;
  role: TUserRole;
};

export type TUserRole = "patient" | "doctor" | "admin";

export type TRegisterUser = {
  fullName: string;
  email: string;
  password: string;
  mobile: string;
  role: TUserRole;
  terms?: boolean;
};

export type TLoginUser = {
  email: string;
  password: string;
};

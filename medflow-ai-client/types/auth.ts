import { IUser } from "./user";

export interface AuthResponse {
  success: boolean;
  message?: string;
  data?: {
    accessToken?: string;
    user?: IUser;
  };
}

export * from "./user";
export * from "./auth";
export * from "./doctor";
export * from "./patient";


export type OneTimeCredentials = {
  email: string;
  password: string;
};

export type DoctorCredentials = OneTimeCredentials;


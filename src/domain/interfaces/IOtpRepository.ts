import { Role } from "../enums/Role.js";

export interface TempAccount {
  firstName: string;
  lastName: string;
  email: string;
  password: string; 
  otp: string;
}

export interface Otp {
  otp:string;
  role:Role.USER|Role.PSYCHOLOGIST
}

export interface IOtpRepository {
  storeTempAccount(key: string, data: TempAccount, ttlSeconds?: number): Promise<void>;
  storeOtp(key: string, data:Otp , ttlSeconds?: number): Promise<void>;
  verifyTempAccount(key: string, otp: string): Promise<TempAccount | null>;
  verifyOtp(key: string, otp: string): Promise<Otp | null>;
  getTempAccount(key: string): Promise<TempAccount | null>;
  getOtp(key: string): Promise< Otp | null>;
  deleteTempAccount(key: string): Promise<void>;
  deleteOtp(key: string): Promise<void>;
}

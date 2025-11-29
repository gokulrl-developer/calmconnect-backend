import dotenv from "dotenv";
dotenv.config();
import  { JwtPayload, SignOptions } from "jsonwebtoken";

export interface IAccessTokenPayload extends JwtPayload {
  id: string;
}

export function getEnv(key: string): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing environment variable: ${key}`);
  }
  return value;
}

export const jwtConfig: {
  accessTokenSecret: string;
  refreshTokenSecret: string;
  accessTokenExpiry: SignOptions["expiresIn"];
  refreshTokenExpiry: SignOptions["expiresIn"];
} = {
  accessTokenSecret: getEnv("ACCESS_TOKEN_SECRET"),
  refreshTokenSecret: getEnv("REFRESH_TOKEN_SECRET"),
  accessTokenExpiry: Number(process.env.ACCESS_TOKEN_EXPIRY!),
  refreshTokenExpiry: Number(process.env.REFRESH_TOKEN_EXPIRY!), 
}

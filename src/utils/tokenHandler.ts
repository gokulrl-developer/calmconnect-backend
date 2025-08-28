import jwt,{ SignOptions } from "jsonwebtoken";
import { IAccessTokenPayload } from "../infrastructure/config/jwtConfig";
import { jwtConfig } from "../infrastructure/config/jwtConfig";


export function generateAccessToken(payload: IAccessTokenPayload): string {
  const options: SignOptions = { expiresIn: jwtConfig.accessTokenExpiry };
  return jwt.sign(payload, jwtConfig.accessTokenSecret, options);
}

export function generateRefreshToken(payload: IAccessTokenPayload): string {
  const options: SignOptions = { expiresIn: jwtConfig.refreshTokenExpiry };
  return jwt.sign(payload, jwtConfig.refreshTokenSecret, options);
}

export function verifyAccessToken(token: string): IAccessTokenPayload {
  try {
    return jwt.verify(token, jwtConfig.accessTokenSecret) as IAccessTokenPayload;
  } catch(error:any) {
    throw error;
  }
}

export function verifyRefreshToken(token: string): IAccessTokenPayload {
  try {
    return jwt.verify(token, jwtConfig.refreshTokenSecret) as IAccessTokenPayload;
  } catch(error:any) {
    throw error;
  }
}

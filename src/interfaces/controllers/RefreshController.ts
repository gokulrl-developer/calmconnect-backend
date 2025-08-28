import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "../../utils/http-statuscodes";
import { generateAccessToken, verifyRefreshToken } from "../../utils/tokenHandler";
import AppError from "../../application/error/AppError";
import { AppErrorCodes } from "../../application/error/app-error-codes";
import { SUCCESS_MESSAGES } from "../constants/success-messages.constants";
import { ERROR_MESSAGES } from "../../application/constants/error-messages.constants";


export class RefreshTokenController {
  async handle(req: Request, res: Response,next:NextFunction): Promise<void> {
    
    try {
      const refreshToken = req.cookies?.refreshToken;
  
      if (!refreshToken) {
        throw new AppError(ERROR_MESSAGES.ACCOUNT_LOGGED_OUT,AppErrorCodes.FORBIDDEN_ERROR);
      
      }
      const payload = verifyRefreshToken(refreshToken);
     
      if(!payload.id || !payload.role){
        throw new AppError(ERROR_MESSAGES.ACCOUNT_LOGGED_OUT,AppErrorCodes.INVALID_CREDENTIALS)
      }
      const newAccessToken = generateAccessToken({id:payload.id,role:payload.role})

      res.cookie('accessToken', newAccessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 * 1000 
      });

     
      res.status(StatusCodes.OK).json({ message: SUCCESS_MESSAGES.TOKEN_REFRESHED });
    } catch (err) {
      next(err)
    }
  }
}

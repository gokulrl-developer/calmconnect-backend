import { Request, Response, NextFunction } from "express";
import { verifyAccessToken } from "../../utils/tokenHandler.js";
import AppError from "../../application/error/AppError.js";
import { AppErrorCodes } from "../../application/error/app-error-codes.js";
import { ERROR_MESSAGES } from "../../application/constants/error-messages.constants.js";

async function verifyTokenMiddleware(req: Request, res: Response, next: NextFunction){
  try{ 
  const token = req.cookies.accessToken;
    if (!token) {
      throw new AppError(ERROR_MESSAGES.SESSION_EXPIRED,AppErrorCodes.INVALID_CREDENTIALS)
    }

    const decoded = await verifyAccessToken(token);
    if (!decoded || !decoded.id || !decoded.role) {
      throw new AppError(ERROR_MESSAGES.SESSION_EXPIRED,AppErrorCodes.SESSION_EXPIRED)
    }
      req.account={id:decoded.id,role:decoded.role,...req.account}

    next();
  }catch(error){
    next(error)
  }
  };

  export default verifyTokenMiddleware;


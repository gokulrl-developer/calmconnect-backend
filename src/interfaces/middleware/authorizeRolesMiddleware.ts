import { Request,Response, NextFunction } from "express";
import AppError from "../../application/error/AppError.js";
import { AppErrorCodes } from "../../application/error/app-error-codes.js";
import { ERROR_MESSAGES } from "../../application/constants/error-messages.constants.js";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req:Request, res: Response, next: NextFunction) => {
     if(!req.account){
      throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,AppErrorCodes.INTERNAL_ERROR)
     }
    
    if (!allowedRoles.includes(req.account!.role)) {
      return next(new AppError(ERROR_MESSAGES.UNAUTHORISED_ACCESS, AppErrorCodes.FORBIDDEN_ERROR));
    }

    next();
  };
};

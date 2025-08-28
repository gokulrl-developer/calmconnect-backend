import { Request, Response, NextFunction } from "express";
import AppError from "../../application/error/AppError";
import { AppErrorCodes } from "../../application/error/app-error-codes";
import { ERROR_MESSAGES } from "../../application/constants/error-messages.constants";

export const authorizeRoles = (...allowedRoles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    
    
    if (!allowedRoles.includes(req.account!.role)) {
      return next(new AppError(ERROR_MESSAGES.UNAUTHORISED_ACCESS, AppErrorCodes.FORBIDDEN_ERROR));
    }

    next();
  };
};

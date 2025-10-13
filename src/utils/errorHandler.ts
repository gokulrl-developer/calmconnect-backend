import { Request, Response, NextFunction } from "express";
import { AppErrorCodes } from "../application/error/app-error-codes";
import AppError from "../application/error/AppError";
import { StatusCodes } from "./http-statuscodes";

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(err)
  if (err.code) {
    const statusCode = errorToHttpStatus(err.code);
    console.log(statusCode,err.code,err.message)
    if (err instanceof AppError) {
      if (statusCode >= 400 && statusCode < 500) {
        return res.status(statusCode).json({
          code: err.code,
          message: err.message,
          success: false,
        });
      } else {
        console.error("custom Error :", err.message, err.code);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          code: "INTERNAL_SERVER_ERROR",
          message: "Internal server error",
          success:false
        });
      }
    }
  }
};


const errorToHttpStatus = (code: string): number => {
  switch (code) {
    case AppErrorCodes.INVALID_CREDENTIALS:
      return StatusCodes.UNAUTHORIZED;
    case AppErrorCodes.EMAIL_ALREADY_USED:
      return StatusCodes.CONFLICT;
    case AppErrorCodes.SESSION_EXPIRED:
      return StatusCodes.UNAUTHORIZED;
    case AppErrorCodes.NOT_FOUND:
      return StatusCodes.NOT_FOUND
    case AppErrorCodes.FORBIDDEN_ERROR:
      return StatusCodes.FORBIDDEN;
    case AppErrorCodes.BLOCKED:
      return StatusCodes.FORBIDDEN;
    case AppErrorCodes.INTERNAL_ERROR:
      return StatusCodes.UNAUTHORIZED;
    case AppErrorCodes.INVALID_OTP:
      return StatusCodes.UNAUTHORIZED;
    case AppErrorCodes.VALIDATION_ERROR:
      return StatusCodes.BAD_REQUEST;   
    case AppErrorCodes.INVALID_INPUT:
      return StatusCodes.BAD_REQUEST;
    case AppErrorCodes.CONFLICT:
      return StatusCodes.CONFLICT
    
    default:
      return StatusCodes.INTERNAL_SERVER_ERROR;
  }
};


import { NextFunction, Request, Response} from "express";
import { AppErrorCodes } from "../application/error/app-error-codes.js";
import AppError from "../application/error/AppError.js";
import { StatusCodes } from "./http-statuscodes.js";
export const errorHandler = (
  err:AppError | Error | { code?: string; message?: string },
  _req: Request,
  res: Response,
  _next:NextFunction
) => {
  console.log("error message and error object",err?.message,err)
  if (err instanceof AppError) {
    const statusCode = errorToHttpStatus(err.code);
    if (statusCode >= 400 && statusCode < 500) {
      return res.status(statusCode).json({
        code: err.code,
        message: err.message,
        success: false,
      });
    } else {
      console.error("Custom Error:", err.message, err.code);
      return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        code: "INTERNAL_SERVER_ERROR",
        message: "Internal server error",
        success: false,
      });
    }
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    code: "INTERNAL_SERVER_ERROR",
    message: "Internal server error",
    success: false,
  });
};


const errorToHttpStatus = (code: string): number => {
  switch (code) {
    case AppErrorCodes.INVALID_CREDENTIALS:
    case AppErrorCodes.SESSION_EXPIRED:
    case AppErrorCodes.INVALID_AUTH:
    case AppErrorCodes.INVALID_OTP:
      return StatusCodes.UNAUTHORIZED;

    case AppErrorCodes.FORBIDDEN_ERROR:
    case AppErrorCodes.BLOCKED:
    case AppErrorCodes.UNAUTHORISED_THERAPY_SESSION_ACCESS:
      return StatusCodes.FORBIDDEN;

    case AppErrorCodes.VALIDATION_ERROR:
    case AppErrorCodes.INVALID_INPUT:
      return StatusCodes.BAD_REQUEST;

    case AppErrorCodes.CONFLICT:
    case AppErrorCodes.EMAIL_ALREADY_USED:
    case AppErrorCodes.OVERLAPPING_AVAILABILITY_RULE:
      return StatusCodes.CONFLICT;
    case AppErrorCodes.COMPLAINT_ALREADY_EXISTS:
      return StatusCodes.CONFLICT;
    case AppErrorCodes.REVIEW_ALREADY_EXISTS:
      return StatusCodes.CONFLICT;

    case AppErrorCodes.NOT_FOUND:
    case AppErrorCodes.THERAPY_SESSION_NOT_FOUND:
      return StatusCodes.NOT_FOUND;
    case AppErrorCodes.PSYCHOLOGIST_NOT_FOUND:
      return StatusCodes.NOT_FOUND;
    case AppErrorCodes.SESSION_NOT_FOUND:
      return StatusCodes.NOT_FOUND;

    case AppErrorCodes.THERAPY_SESSION_NOT_OPEN_YET:
      return StatusCodes.BAD_REQUEST; 
    case AppErrorCodes.THERAPY_SESSION_EXPIRED:
      return StatusCodes.GONE; 

    case AppErrorCodes.INTERNAL_ERROR:
      return StatusCodes.INTERNAL_SERVER_ERROR;

    default:
      return StatusCodes.INTERNAL_SERVER_ERROR;
  }
};


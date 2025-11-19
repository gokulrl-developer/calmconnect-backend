import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "../../utils/http-statuscodes.js";
import AppError from "../../application/error/AppError.js";
import { AppErrorCodes } from "../../application/error/app-error-codes.js";
import { SUCCESS_MESSAGES } from "../constants/success-messages.constants.js";



export class LogoutController {
  async handle(req: Request, res: Response,next:NextFunction): Promise<void> {
   try{
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict" as const,
      };
      res.clearCookie("accessToken", { ...cookieOptions, path: "/" });
      res.clearCookie("refreshToken", { ...cookieOptions, path: "/refresh" });
    res.status(StatusCodes.OK).json({ message: SUCCESS_MESSAGES.LOGOUT_SUCCESSFUL });
    } catch (err) {
        console.log(err)
        next(
            new AppError("Logout Failed",AppErrorCodes.INTERNAL_ERROR)
        )
    }
  }
}

import { NextFunction, Request, Response } from "express";
import { StatusCodes } from "../../utils/http-statuscodes";
import AppError from "../../application/error/AppError";
import { AppErrorCodes } from "../../application/error/app-error-codes";
import { SUCCESS_MESSAGES } from "../constants/success-messages.constants";



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

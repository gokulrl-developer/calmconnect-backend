import { Request, Response, NextFunction } from "express";
import { AppErrorCodes } from "../../../application/error/app-error-codes.js";
import AppError from "../../../application/error/AppError.js";
import { IGoogleAuthUserUseCase } from "../../../application/interfaces/IGoogleAuthUserUseCase.js";
import { ILoginUserUseCase } from "../../../application/interfaces/ILoginUserUseCase.js";
import { IRegisterUserUseCase } from "../../../application/interfaces/IRegisterUserUseCase.js";
import { IResendOtpSignUpUserUseCase } from "../../../application/interfaces/IResendOtpSignUpUserUseCase.js";
import { ISignUpUserUseCase } from "../../../application/interfaces/ISignUpUserUseCase.js";
import {
  UserForgotPasswordDTO,
  UserLoginDTO,
  UserResendOtpDTO,
  UserSignUpDTO,
} from "../../../application/dtos/user.dto.js";
import { StatusCodes } from "../../../utils/http-statuscodes.js";
import { IResendOtpResetUserUseCase } from "../../../application/interfaces/IResendOtpResetUserUseCase.js";
import IForgotPasswordUserUseCase from "../../../application/interfaces/IForgotPasswordUserUseCase.js";
import IResetPasswordUserUseCase from "../../../application/interfaces/IResetPasswordUserUseCase.js";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants.js";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants.js";

export default class AuthController {
  constructor(
    private _registerUserUseCase: IRegisterUserUseCase,
    private _signUpUserUseCase: ISignUpUserUseCase,
    private _loginUseCase: ILoginUserUseCase,
    private _googleAuthUseCase: IGoogleAuthUserUseCase,
    private _resendOtpSignUpUseCase: IResendOtpSignUpUserUseCase,
    private _resendOtpResetUseCase: IResendOtpResetUserUseCase,
    private _forgotPasswordUseCase: IForgotPasswordUserUseCase,
    private _resetPasswordUseCase: IResetPasswordUserUseCase
  ) {}

  async registerUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.body.email || typeof req.body.email !== "string") {
        throw new AppError(
          ERROR_MESSAGES.EMAIL_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (!req.body.otp || typeof req.body.otp !== "string") {
        throw new AppError(
          ERROR_MESSAGES.OTP_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      await this._registerUserUseCase.execute(req.body);
      res
        .status(StatusCodes.CREATED)
        .json({ message: SUCCESS_MESSAGES.REGISTRATION_SUCCESSFUL });
    } catch (error) {
      next(error);
    }
  }
  async resetPassword(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.body.email || typeof req.body.email !== "string") {
        throw new AppError(
          ERROR_MESSAGES.EMAIL_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (!req.body.otp || typeof req.body.otp !== "string") {
        throw new AppError(
          ERROR_MESSAGES.OTP_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (!req.body.password || typeof req.body.password !== "string") {
        throw new AppError(
          ERROR_MESSAGES.PASSWORD_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
       await this._resetPasswordUseCase.execute(req.body);
      res
        .status(StatusCodes.CREATED)
        .json({ message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESSFUL });
    } catch (error) {
      next(error);
    }
  }

  async signUpUser(
    req: Request<unknown, unknown, UserSignUpDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.body.email || typeof req.body.email !== "string") {
        throw new AppError(
          ERROR_MESSAGES.EMAIL_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (!req.body.password || typeof req.body.password !== "string") {
        throw new AppError(
          ERROR_MESSAGES.PASSWORD_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      await this._signUpUserUseCase.execute(req.body);
      res.status(StatusCodes.OK).json({ message: SUCCESS_MESSAGES.OTP_SENT });
    } catch (error) {
      next(error);
    }
  }

  async forgotPassword(
    req: Request<unknown, unknown, UserForgotPasswordDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.body.email || typeof req.body.email !== "string") {
        throw new AppError(
          ERROR_MESSAGES.EMAIL_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      await this._forgotPasswordUseCase.execute(req.body);
      res.status(StatusCodes.OK).json({ message: SUCCESS_MESSAGES.OTP_SENT });
    } catch (error) {
      next(error);
    }
  }

  async loginUser(
    req: Request<unknown, unknown, UserLoginDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.body.email || typeof req.body.email !== "string") {
        throw new AppError(
          ERROR_MESSAGES.EMAIL_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (!req.body.password || typeof req.body.password !== "string") {
        throw new AppError(
          ERROR_MESSAGES.PASSWORD_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      const result = await this._loginUseCase.execute(req.body);
      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE!),
        path: "/refresh",
      });
      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: Number(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE!),
        path: "/",
      });

      const { refreshToken:_refreshToken, accessToken:_accessToken, ...user } = result;

      res
        .status(StatusCodes.OK)
        .json({ ...user, message: SUCCESS_MESSAGES.USER_LOGGED_IN });
    } catch (error) {
      next(error);
    }
  }

  async googleAuthUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.body.code || typeof req.body.code !== "string") {
        throw new AppError(
          ERROR_MESSAGES.INVALID_GOOGLE_AUTH_CODE,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      const result = await this._googleAuthUseCase.execute(req.body);

      res.cookie("refreshToken", result.refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: Number(process.env.REFRESH_TOKEN_COOKIE_MAX_AGE!),
        path: "/refresh",
      });

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: Number(process.env.ACCESS_TOKEN_COOKIE_MAX_AGE!),
        path: "/",
      });


      res
        .status(StatusCodes.OK)
        .json({ user:result.user, message: SUCCESS_MESSAGES.GOOGLE_AUTH_SUCCESSFUL });
    } catch (error) {
      next(error);
    }
  }

  async resendOtpSignUp(
    req: Request<unknown, unknown, UserResendOtpDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.body.email || typeof req.body.email !== "string") {
        throw new AppError(
          ERROR_MESSAGES.EMAIL_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      await this._resendOtpSignUpUseCase.execute(req.body);

      res.status(StatusCodes.OK).json({ message: SUCCESS_MESSAGES.OTP_RESENT });
    } catch (error) {
      next(error);
    }
  }
  async resendOtpReset(
    req: Request<unknown, unknown, UserResendOtpDTO>,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.body.email || typeof req.body.email !== "string") {
        throw new AppError(
          ERROR_MESSAGES.EMAIL_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      await this._resendOtpResetUseCase.execute(req.body);

      res.status(StatusCodes.OK).json({ message: SUCCESS_MESSAGES.OTP_RESENT });
    } catch (error) {
      next(error);
    }
  }
}

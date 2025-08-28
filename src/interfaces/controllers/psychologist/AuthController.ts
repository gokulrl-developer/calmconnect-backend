import { Request, Response, NextFunction } from "express";
import { AppErrorCodes } from "../../../application/error/app-error-codes";
import AppError from "../../../application/error/AppError";
import { IGoogleAuthPsychUseCase } from "../../../application/interfaces/IGoogleAuthPsychUseCase";
import { ILoginPsychUseCase } from "../../../application/interfaces/ILoginPsychUseCase";
import { IRegisterPsychUseCase } from "../../../application/interfaces/IRegisterPsychUseCase";
import { IResendOtpSignUpPsychUseCase } from "../../../application/interfaces/IResendOtpSignUpPsychUseCase";
import { ISignUpPsychUseCase } from "../../../application/interfaces/ISignUpPsychUseCase";
import {
  PsychForgotPasswordDTO,
  PsychLoginDTO,
  PsychResendOtpDTO,
  PsychSignUpDTO,
} from "../../../domain/dtos/psych.dto";
import { StatusCodes } from "../../../utils/http-statuscodes";
import { IResendOtpResetPsychUseCase } from "../../../application/interfaces/IResendOtpResetPsychUseCase";
import IForgotPasswordPsychUseCase from "../../../application/interfaces/IForgotPasswordPsychUseCase";
import IResetPasswordPsychUseCase from "../../../application/interfaces/IResetPasswordPsychUseCase";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants";

export default class AuthController {
  constructor(
    private _registerPsychUseCase: IRegisterPsychUseCase,
    private _signUpPsychUseCase: ISignUpPsychUseCase,
    private _loginUseCase: ILoginPsychUseCase,
    private _googleAuthUseCase: IGoogleAuthPsychUseCase,
    private _resendOtpSignUpUseCase: IResendOtpSignUpPsychUseCase,
    private _resendOtpResetUseCase: IResendOtpResetPsychUseCase,
    private _forgotPasswordUseCase: IForgotPasswordPsychUseCase,
    private _resetPasswordUseCase: IResetPasswordPsychUseCase
  ) {}

  async registerPsych(
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

      const result = await this._registerPsychUseCase.execute(req.body);
      res
        .status(StatusCodes.CREATED)
        .json({ message: SUCCESS_MESSAGES.REGISTRATION_SUCCESSFUL });
    } catch (error) {
      next();
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
      const result = await this._resetPasswordUseCase.execute(req.body);
      res
        .status(StatusCodes.CREATED)
        .json({ message: SUCCESS_MESSAGES.PASSWORD_RESET_SUCCESSFUL });
    } catch (error) {
      next();
    }
  }

  async signUpPsych(
    req: Request<unknown, unknown, PsychSignUpDTO>,
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
      await this._signUpPsychUseCase.execute(req.body);
      res.status(StatusCodes.OK).json({ message: SUCCESS_MESSAGES.OTP_SENT });
    } catch (error) {
      next(error);
    }
  }

  async forgotPasswordPsych(
    req: Request<unknown, unknown, PsychForgotPasswordDTO>,
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

  async loginPsych(
    req: Request<unknown, unknown, PsychLoginDTO>,
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
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/refresh",
      });

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 15 * 1000,
        path: "/",
      });

      const { refreshToken, accessToken, ...Psych } = result;

      res
        .status(StatusCodes.OK)
        .json({ ...Psych, message: SUCCESS_MESSAGES.PSYCH_LOGGED_IN });
    } catch (error) {
      next(error);
    }
  }

  async googleAuthPsych(
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
        maxAge: 7 * 24 * 60 * 60 * 1000,
        path: "/refresh",
      });

      res.cookie("accessToken", result.accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        maxAge: 60 * 15 * 1000,
        path: "/",
      });

      res
        .status(StatusCodes.OK)
        .json({
          psych: result.psych,
          message: SUCCESS_MESSAGES.GOOGLE_AUTH_SUCCESSFUL,
        });
    } catch (error) {
      next(error);
    }
  }

  async resendOtpSignUp(
    req: Request<unknown, unknown, PsychResendOtpDTO>,
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
    req: Request<unknown, unknown, PsychResendOtpDTO>,
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

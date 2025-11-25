import { Request, Response, NextFunction } from "express";
import AppError from "../../../application/error/AppError.js";
import { AppErrorCodes } from "../../../application/error/app-error-codes.js";
import { StatusCodes } from "../../../utils/http-statuscodes.js";
import IFetchUserProfileUseCase from "../../../application/interfaces/IFetchUserProfileUseCase.js";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants.js";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants.js";
import IUpdateUserProfileUseCase from "../../../application/interfaces/IUpdateUserProfileUseCase.js";
import IFetchUserDashboardUseCase from "../../../application/interfaces/IFetchUserDashboardUseCase.js";

export default class UserController {
  constructor(
    private readonly _fetchUserProfileUseCase: IFetchUserProfileUseCase,
    private readonly _updateUserProfileUseCase: IUpdateUserProfileUseCase,
    private readonly _fetchUserDashboardUseCase: IFetchUserDashboardUseCase
  ) {}
  async getDashboard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.account) {
        throw new AppError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          AppErrorCodes.INTERNAL_ERROR
        );
      }
      const userId = req.account.id;

      const dashboardData = await this._fetchUserDashboardUseCase.execute({
        userId: userId!,
      });

      res.status(StatusCodes.OK).json({
        dashboard: dashboardData,
      });
    } catch (err) {
      next(err);
    }
  }

  async fetchProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.account) {
        throw new AppError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          AppErrorCodes.INTERNAL_ERROR
        );
      }
      const userId = req.account.id;
      const userProfile = await this._fetchUserProfileUseCase.execute({
        userId: userId!,
      });

      res.status(StatusCodes.OK).json({ profile: userProfile });
    } catch (error) {
      next(error);
    }
  }

  async updateProfile(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if (!req.account) {
        throw new AppError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          AppErrorCodes.INTERNAL_ERROR
        );
      }
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const { address, firstName, lastName, gender, dob } = req.body;
      if (address !== undefined) {
        if (typeof address !== "string" || !address.trim()) {
          throw new AppError(
            ERROR_MESSAGES.ADDRESS_REQUIRED,
            AppErrorCodes.VALIDATION_ERROR
          );
        }
      }

      if (firstName !== undefined) {
        if (typeof firstName !== "string" || !firstName.trim()) {
          throw new AppError(
            ERROR_MESSAGES.FIRST_NAME_REQUIRED,
            AppErrorCodes.VALIDATION_ERROR
          );
        }
      }

      if (lastName !== undefined) {
        if (typeof lastName !== "string" || !lastName.trim()) {
          throw new AppError(
            ERROR_MESSAGES.LAST_NAME_REQUIRED,
            AppErrorCodes.VALIDATION_ERROR
          );
        }
      }

      const allowedGenders = ["male", "female", "others"];
      if (gender !== undefined) {
        if (typeof gender !== "string" || !allowedGenders.includes(gender)) {
          throw new AppError(
            ERROR_MESSAGES.GENDER_REQUIRED,
            AppErrorCodes.VALIDATION_ERROR
          );
        }
      }

      if (dob !== undefined) {
        const date = new Date(dob);
        if (isNaN(date.getTime())) {
          throw new AppError(
            ERROR_MESSAGES.DOB_REQUIRED,
            AppErrorCodes.VALIDATION_ERROR
          );
        }
      }

      let profilePicture: string | Buffer | undefined;
      if (files?.profilePicture?.[0]) {
        const file = files.profilePicture[0];
        if (!(file.buffer instanceof Buffer)) {
          throw new AppError(
            ERROR_MESSAGES.PROFILE_PICTURE_REQUIRED,
            AppErrorCodes.VALIDATION_ERROR
          );
        }
        profilePicture = file.buffer;
      }

      await this._updateUserProfileUseCase.execute({
        userId: req.account.id!,
        ...req.body,
        profilePicture,
      });

      res.status(StatusCodes.OK).json({
        message: SUCCESS_MESSAGES.PROFILE_UPDATED,
      });
    } catch (error) {
      next(error);
    }
  }
}

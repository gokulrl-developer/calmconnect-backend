import { Request, Response, NextFunction } from "express";
import AppError from "../../../application/error/AppError";
import { AppErrorCodes } from "../../../application/error/app-error-codes";
import { StatusCodes } from "../../../utils/http-statuscodes";
import IFetchPsychProfileUseCase from "../../../application/interfaces/IFetchPsychProfileUseCase";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants";
import IUpdatePsychProfileUseCase from "../../../application/interfaces/IUpdatePsychProfileUseCase";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants";
import IFetchPsychDashboardUseCase from "../../../application/interfaces/IFetchPsychDashboardUseCase";

export default class PsychController {
  constructor(
    private readonly _fetchPsychProfileUseCase: IFetchPsychProfileUseCase,
    private readonly _updatePsychProfileUseCase: IUpdatePsychProfileUseCase,
    private readonly _fetchPsychDashboardUseCase: IFetchPsychDashboardUseCase
  ) {}
  async getDashboard(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const psychId = req.account?.id!;
      const { fromDate, toDate } = req.query;

      const dto = {
        psychId,
      };

      const dashboardData = await this._fetchPsychDashboardUseCase.execute(dto);

      res.status(StatusCodes.OK).json({ dashboard: dashboardData });
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
      const psychId = req?.account?.id;
      const psychProfile = await this._fetchPsychProfileUseCase.execute({
        psychId: psychId!,
      });

      res.status(StatusCodes.OK).json({ profile: psychProfile });
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
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      const psychId = req.account?.id;

      let {
        address,
        languages,
        specializations,
        bio,
        hourlyFees,
        quickSlotHourlyFees,
        qualifications,
      } = req.body;

      if (address !== undefined && typeof address !== "string") {
        throw new AppError(
          ERROR_MESSAGES.ADDRESS_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      if (languages !== undefined && typeof languages !== "string") {
        throw new AppError(
          ERROR_MESSAGES.LANGUAGES_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      let specializationsArray: string[] = [];
      if (specializations !== undefined) {
        specializationsArray =
          typeof specializations === "string"
            ? JSON.parse(specializations)
            : specializations;

        if (
          !Array.isArray(specializationsArray) ||
          specializationsArray.length === 0 ||
          !specializationsArray.every(
            (s) => typeof s === "string" && s.trim() !== ""
          )
        ) {
          throw new AppError(
            ERROR_MESSAGES.SPECIALIZATIONS_REQUIRED,
            AppErrorCodes.VALIDATION_ERROR
          );
        } else {
          req.body.specializations = specializationsArray;
        }
      }

      if (bio !== undefined && typeof bio !== "string") {
        throw new AppError(
          ERROR_MESSAGES.BIO_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      if (
        hourlyFees !== undefined &&
        (isNaN(Number(hourlyFees)) || Number(hourlyFees) <= 0)
      ) {
        throw new AppError(
          ERROR_MESSAGES.INVALID_HOURLY_FEES,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      if (
        quickSlotHourlyFees !== undefined &&
        (isNaN(Number(quickSlotHourlyFees)) || Number(quickSlotHourlyFees) <= 0)
      ) {
        throw new AppError(
          ERROR_MESSAGES.INVALID_QUICK_SLOT_FEES,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      if (qualifications !== undefined && typeof qualifications !== "string") {
        throw new AppError(
          ERROR_MESSAGES.QUALIFICATIONS_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      let profilePicture: Buffer | undefined = undefined;
      if (files?.profilePicture?.[0]?.buffer instanceof Buffer) {
        profilePicture = files.profilePicture[0].buffer;
      }

      await this._updatePsychProfileUseCase.execute({
        psychId: psychId!,
        ...req.body,
        ...(profilePicture && { profilePicture: profilePicture }),
      });

      res.status(StatusCodes.OK).json({
        message: SUCCESS_MESSAGES.PROFILE_UPDATED,
      });
    } catch (error) {
      next(error);
    }
  }
}

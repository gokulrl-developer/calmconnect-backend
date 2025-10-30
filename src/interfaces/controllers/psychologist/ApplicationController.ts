import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../../utils/http-statuscodes";
import ICreateApplicationUseCase from "../../../application/interfaces/ICreateApplicationUseCase";
import IApplicationStatusUseCase from "../../../application/interfaces/IFetchLatestApplicationUseCase";
import AppError from "../../../application/error/AppError";
import { AppErrorCodes } from "../../../application/error/app-error-codes";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants";
import IFetchLatestApplicationUseCase from "../../../application/interfaces/IFetchLatestApplicationUseCase";

export default class ApplicationController {
  constructor(
    private readonly _createApplicationUseCase: ICreateApplicationUseCase,
    private readonly _fetchLatestApplicationUseCase: IFetchLatestApplicationUseCase,
  ) {}

  async createApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const files = req.files as { [fieldname: string]: Express.Multer.File[] };
      if (
        !req.body.submittedAt ||
        isNaN(Date.parse(req.body.submittedAt.trim()))
      ) {
        throw new AppError(
          ERROR_MESSAGES.SUBMISSION_DATE_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (!req.body.phone || typeof req.body.phone.trim() !== "string") {
        throw new AppError(
          ERROR_MESSAGES.PHONE_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (
        !req.body.gender ||
        !["male", "female", "others"].includes(req.body.gender)
      ) {
        throw new AppError(
          ERROR_MESSAGES.GENDER_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (!req.body.dob || isNaN(Date.parse(req.body.dob.trim()))) {
        throw new AppError(
          ERROR_MESSAGES.DOB_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (!req.body.address || typeof req.body.address.trim() !== "string") {
        throw new AppError(
          ERROR_MESSAGES.ADDRESS_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (
        !req.body.languages ||
        typeof req.body.languages.trim() !== "string"
      ) {
        throw new AppError(
          ERROR_MESSAGES.LANGUAGES_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (
        !req.body.specializations ||
        !Array.isArray(req.body.specializations) ||
        req.body.specializations.length === 0 ||
        !req.body.specializations.every(
          (s: any) => typeof s === "string" && s.trim() !== ""
        )
      ) {
        throw new AppError(
          ERROR_MESSAGES.SPECIALIZATIONS_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (
        !req.body.qualifications ||
        typeof req.body.qualifications.trim() !== "string"
      ) {
        throw new AppError(
          ERROR_MESSAGES.QUALIFICATIONS_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (!req.body.bio || typeof req.body.bio.trim() !== "string") {
        throw new AppError(
          ERROR_MESSAGES.BIO_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if ((!req.body.license || typeof req.body.license !=="string") &&(!files?.license || !(files.license?.[0].buffer instanceof Buffer))) {
        throw new AppError(
          ERROR_MESSAGES.LICENSE_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if ((!req.body.profilePicture || typeof req.body.profilePicture !== "string") &&(!files?.profilePicture || !(files.profilePicture?.[0].buffer instanceof Buffer))) {
        throw new AppError(
          ERROR_MESSAGES.PROFILE_PICTURE_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if ((!req.body.resume || typeof req.body.resume !=="string") &&(!files?.resume || !(files.resume?.[0].buffer instanceof Buffer))) {
        throw new AppError(
          ERROR_MESSAGES.RESUME_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      await this._createApplicationUseCase.execute({
        ...req.body,
        psychId: req?.account?.id,
        license: req.body.license? req.body.license:files?.license?.[0].buffer,
        profilePicture: req.body.profilePicture?req.body.profilePicture:files?.profilePicture?.[0].buffer,
        resume: req.body.resume?req.body.resume:files?.resume?.[0].buffer,
      });
      res.status(StatusCodes.CREATED).json({
        message: SUCCESS_MESSAGES.SUBMISSION_SUCCESSFUL,
      });
    } catch (error) {
      next(error);
    }
  }

  async getApplication(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const psychId = req?.account?.id;

      const applicationData = await this._fetchLatestApplicationUseCase.execute({
        psychId: psychId!,
      });

      res.status(StatusCodes.OK).json({ application:applicationData.application, psych: req.account });
    } catch (error) {
      next(error);
    }
  }
 
}

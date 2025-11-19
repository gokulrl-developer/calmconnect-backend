import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../../utils/http-statuscodes.js";
import IApplicationListUseCase from "../../../application/interfaces/IApplicationListUseCase.js";
import IUpdateApplicationUseCase from "../../../application/interfaces/IUpdateApplicationUseCase.js";
import {
  ListApplicationsDTO,
  UpdateApplicationStatusDTO,
} from "../../../application/dtos/admin.dto.js";
import AppError from "../../../application/error/AppError.js";
import IApplicationDetailsUseCase from "../../../application/interfaces/IApplicationDetailsUseCase.js";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants.js";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants.js";
import { AppErrorCodes } from "../../../application/error/app-error-codes.js";

export default class ApplicationController {
  constructor(
    private _listUseCase: IApplicationListUseCase,
    private _updateUseCase: IUpdateApplicationUseCase,
    private _applicationDetailsUseCase: IApplicationDetailsUseCase
  ) {}

  async listApplications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const validStatuses = ["pending", "accepted", "rejected"] as const;
      if (req.query.status) {
      if (
        typeof req.query.status !== "string" ||
        !validStatuses.includes(req.query.status as typeof validStatuses[number])
      ) {
        throw new AppError(
          ERROR_MESSAGES.APPLICATION_STATUS_FILTER_INVALID,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
    }
      const dto: ListApplicationsDTO = {
        page: parseInt(req.query.page as string) || 1,
        search: (req.query?.search as string) || null,
        status:
          req.query.status ? req.query.status as "pending"|"accepted"|"rejected": undefined,
      };
      const applications = await this._listUseCase.execute(dto);
      res.status(StatusCodes.OK).json({ success: true, data: applications });
    } catch (error) {
      next(error);
    }
  }

  async updateApplicationStatus(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const dto: UpdateApplicationStatusDTO = {
        applicationId: req.params.id,
        status: req.body.status,
        reason: req.body.reason || null,
      };
      if (dto.status !== "accepted" && dto.status !== "rejected") {
        throw new AppError(
          ERROR_MESSAGES.STATUS_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (
        dto.status === "rejected" &&
        (!dto.reason ||
          typeof dto.reason !== "string" ||
          dto.reason.trim() === "")
      ) {
        throw new AppError(
          ERROR_MESSAGES.STATUS_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      await this._updateUseCase.execute(dto);
      res
        .status(StatusCodes.OK)
        .json({
          success: true,
          message: SUCCESS_MESSAGES.APPLICATIONS_FETCHED,
        });
    } catch (error) {
      next(error);
    }
  }

  async findApplicationDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    try {
      const dto = {
        applicationId: req.params.id,
      };
      const details = await this._applicationDetailsUseCase.execute(dto);
      res
        .status(StatusCodes.OK)
        .json({ details, message: SUCCESS_MESSAGES.APPLICATION_FETCHED });
    } catch (error) {
      next(error);
    }
  }
}

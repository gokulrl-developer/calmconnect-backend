import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../../utils/http-statuscodes.js";
import AppError from "../../../application/error/AppError.js";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants.js";
import { AppErrorCodes } from "../../../application/error/app-error-codes.js";
import IComplaintDetailsByAdminUseCase from "../../../application/interfaces/IComplaintDetailsByAdminUseCase.js";
import IComplaintListingByAdminUseCase from "../../../application/interfaces/IComplaintListingByAdminUseCase.js";
import IComplaintResolutionUseCase from "../../../application/interfaces/IComplaintResolutionUseCase.js";
import {
  ComplaintDetailsByAdminDTO,
  ComplaintResolutionDTO,
} from "../../../application/dtos/admin.dto.js";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants.js";
import IComplaintHistoryByPsychUseCase from "../../../application/interfaces/IComplaintHistoryByPsychUseCase.js";
import { ComplaintStatus } from "../../../domain/enums/ComplaintStatus.js";

export default class ComplaintController {
  constructor(
    private _complaintDetailsByAdminUseCase: IComplaintDetailsByAdminUseCase,
    private _complaintListingByAdminUseCase: IComplaintListingByAdminUseCase,
    private _complaintResolutionUseCase: IComplaintResolutionUseCase,
    private _complaintHistoryByPsychUseCase: IComplaintHistoryByPsychUseCase
  ) {}

  async fetchComplaintDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { complaintId } = req.params;
      if (!complaintId) {
        throw new AppError(
          ERROR_MESSAGES.DATA_INSUFFICIANT,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      const dto: ComplaintDetailsByAdminDTO = { complaintId };
      const complaint = await this._complaintDetailsByAdminUseCase.execute(dto);

      res.status(StatusCodes.OK).json({ ...complaint });
    } catch (error) {
      next(error);
    }
  }

  async listComplaints(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { status, search } = req.query;
      if (!req.pagination) {
        throw new AppError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          AppErrorCodes.INTERNAL_ERROR
        );
      }
      if (
        status &&
        (typeof status !== "string" ||
          (ComplaintStatus.PENDING !== status &&ComplaintStatus.RESOLVED!==status))
      ) {
        throw new AppError(
          ERROR_MESSAGES.COMPLAINT_STATUS_INVALID,
          AppErrorCodes.INVALID_INPUT
        );
      }

      if (search && typeof search !== "string") {
        throw new AppError(
          ERROR_MESSAGES.SEARCH_FIELD_INVALID,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      const dto = {
        skip: req.pagination.skip!,
        limit: req.pagination.limit!,
        status: status as ComplaintStatus | undefined,
        search: search ? search : undefined,
      };

      const result = await this._complaintListingByAdminUseCase.execute(dto);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }
  async listComplaintHistory(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { psychId } = req.query;
      if (!req.pagination) {
        throw new AppError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          AppErrorCodes.INTERNAL_ERROR
        );
      }
      if (!psychId || typeof psychId !== "string") {
        throw new AppError(
          ERROR_MESSAGES.DATA_INSUFFICIANT,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      const dto = {
        psychId: psychId!,
        skip: req.pagination.skip!,
        limit: req.pagination.limit!,
      };

      const result = await this._complaintHistoryByPsychUseCase.execute(dto);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  async resolveComplaint(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { complaintId } = req.params;
      const { adminNotes } = req.body;
      if (!req.pagination) {
        throw new AppError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          AppErrorCodes.INTERNAL_ERROR
        );
      }
      if (!complaintId) {
        throw new AppError(
          ERROR_MESSAGES.DATA_INSUFFICIANT,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (!adminNotes || typeof adminNotes !== "string") {
        throw new AppError(
          ERROR_MESSAGES.ADMIN_NOTES_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      const dto: ComplaintResolutionDTO = {
        complaintId,
        adminNotes,
      };

      await this._complaintResolutionUseCase.execute(dto);
      res
        .status(StatusCodes.OK)
        .json({ message: SUCCESS_MESSAGES.COMPLAINT_RESOLVED });
    } catch (error) {
      next(error);
    }
  }
}

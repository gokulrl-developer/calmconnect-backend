import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../../utils/http-statuscodes";
import AppError from "../../../application/error/AppError";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants";
import { AppErrorCodes } from "../../../application/error/app-error-codes";

import ICreateComplaintUseCase from "../../../application/interfaces/ICreateComplaintUseCase";
import IComplaintDetailsByUserUseCase from "../../../application/interfaces/IComplaintDetailsByUserUseCase";

import {
  CreateComplaintDTO,
  ListComplaintsDTO,
  ComplaintDetailsDTO,
} from "../../../application/dtos/user.dto";
import IComplaintListingByUserUseCase from "../../../application/interfaces/IComplaintListinByUserUseCase";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants";

export default class ComplaintController {
  constructor(
    private _createComplaintUseCase: ICreateComplaintUseCase,
    private _complaintListingByUserUseCase: IComplaintListingByUserUseCase,
    private _complaintDetailsByUserUseCase: IComplaintDetailsByUserUseCase
  ) {}

  /**
   * @route POST /user/complaints
   * @desc Create a new complaint
   */
  async createComplaint(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { sessionId, description } = req.body;
      const userId = req.account?.id; 


      if (!sessionId || typeof sessionId !== "string") {
        throw new AppError(
          ERROR_MESSAGES.DATA_INSUFFICIANT,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      if (!description || typeof description !== "string") {
        throw new AppError(
          ERROR_MESSAGES.COMPLAINT_DESCRIPTION_REQUIRED,
          AppErrorCodes.VALIDATION_ERROR
        );
      }

      const dto: CreateComplaintDTO = { userId:userId!, sessionId, description };
      await this._createComplaintUseCase.execute(dto);

      res
        .status(StatusCodes.CREATED)
        .json({ message: SUCCESS_MESSAGES.COMPLAINT_SUBMITTED });
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
      const userId = req.account?.id;
      

      const dto: ListComplaintsDTO = {
        userId:userId!,
        skip: req.pagination?.skip!,
        limit: req.pagination?.limit!,
      };

      const result = await this._complaintListingByUserUseCase.execute(dto);
      res.status(StatusCodes.OK).json(result);
    } catch (error) {
      next(error);
    }
  }

  
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

      const dto: ComplaintDetailsDTO = { complaintId };
      const complaint = await this._complaintDetailsByUserUseCase.execute(dto);

      res.status(StatusCodes.OK).json({ ...complaint });
    } catch (error) {
      next(error);
    }
  }
}

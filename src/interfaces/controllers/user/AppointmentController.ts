import { Request, Response, NextFunction } from "express";
import IListPsychByUserUseCase from "../../../application/interfaces/IListPsychByUserUseCase";
import { StatusCodes } from "../../../utils/http-statuscodes";
import IPsychDetailsByUserUseCase, {
  PsychDetails,
} from "../../../application/interfaces/IPsychDetailsByUserUseCase";
import AppError from "../../../application/error/AppError";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants";
import { AppErrorCodes } from "../../../application/error/app-error-codes";
import {VerifyPaymentDTO, CreateOrderDTO, FetchCheckoutDataDTO } from "../../../domain/dtos/user.dto";
import IFetchCheckoutDataUseCase from "../../../application/interfaces/IFetchCheckoutDataUseCase";
import ICreateOrderUseCase from "../../../application/interfaces/ICreateOrderUseCase";
import IVerifyPaymentUseCase from "../../../application/interfaces/IVerifyPaymentUseCase";

export default class AppointmentController {
  constructor(
    private readonly _listPsychByUserUseCase: IListPsychByUserUseCase,
    private readonly _psychDetailsUseCase: IPsychDetailsByUserUseCase,
    private readonly _fetchCheckoutDataUseCase: IFetchCheckoutDataUseCase,
    private readonly _createOrderUseCase:ICreateOrderUseCase,
    private readonly _verifyPaymentUseCase:IVerifyPaymentUseCase
  ) {}
  async listPsychologists(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const result = await this._listPsychByUserUseCase.execute({
        ...req.query,
        skip: req.pagination?.skip!,
        limit: req.pagination?.limit!,
      });
      res.status(StatusCodes.OK).json({ ...result });
    } catch (err) {
      next(err);
    }
  }

  async psychDetails(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const psychId = req.query.psychId;
      const date = req.query.date;
      if (date && typeof date !== "string") {
        throw new AppError(
          ERROR_MESSAGES.DATE_INVALID_FORMAT,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      if (psychId && typeof psychId !== "string") {
        throw new AppError(
          ERROR_MESSAGES.DATA_INSUFFICIANT,
          AppErrorCodes.VALIDATION_ERROR
        );
      }
      const result = await this._psychDetailsUseCase.execute({
        psychId: psychId!,
        date: date,
      });

      res.status(StatusCodes.OK).json({ ...result });
    } catch (error) {
      next(error);
    }
  }

  async fetchCheckoutData(req: Request, res: Response,next:NextFunction) {
    try {
      const dto: FetchCheckoutDataDTO = {
        psychId:String(req.query.psychId),
        date:String(req.query.date),
        startTime:String(req.query.startTime)
      };

      if (!dto.psychId || typeof dto.psychId !== "string") {
        throw new AppError(ERROR_MESSAGES.DATA_INSUFFICIANT,AppErrorCodes.VALIDATION_ERROR)
      }

      if (!dto.date || typeof dto.date !== "string") {
        throw new AppError(ERROR_MESSAGES.DATE_REQUIRED,AppErrorCodes.VALIDATION_ERROR)
      }

      if (!dto.startTime || typeof dto.startTime !== "string") {
         throw new AppError(ERROR_MESSAGES.DATA_INSUFFICIANT,AppErrorCodes.VALIDATION_ERROR)

      }
      const checkoutData = await this._fetchCheckoutDataUseCase.execute(dto);

      res.status(200).json({
        data: checkoutData,
      });
    } catch (error: any) {
     next(error)
    }
  }
  
  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const userId=req?.account?.id;
      const dto: CreateOrderDTO = {userId,...req.body};

      if (!dto.userId || typeof dto.userId !== "string") {
        throw new AppError(ERROR_MESSAGES.DATA_INSUFFICIANT, AppErrorCodes.VALIDATION_ERROR);
      }
      if (!dto.psychId || typeof dto.psychId !== "string") {
        throw new AppError(ERROR_MESSAGES.DATA_INSUFFICIANT, AppErrorCodes.VALIDATION_ERROR);
      }
      if (!dto.date || typeof dto.date !== "string") {
        throw new AppError(ERROR_MESSAGES.DATE_REQUIRED, AppErrorCodes.VALIDATION_ERROR);
      }
      if (!dto.startTime || typeof dto.startTime !== "string") {
        throw new AppError(ERROR_MESSAGES.DATA_INSUFFICIANT, AppErrorCodes.VALIDATION_ERROR);
      }

      const orderData = await this._createOrderUseCase.execute(dto);
      res.status(StatusCodes.OK).json({ data: orderData });
    } catch (error) {
      next(error);
    }
  }

  async verifyPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const userId=req.account?.id;
      const dto: VerifyPaymentDTO = {userId,...req.body};

      if (!dto.providerOrderId || typeof dto.providerOrderId !== "string") {
        throw new AppError(ERROR_MESSAGES.DATA_INSUFFICIANT, AppErrorCodes.VALIDATION_ERROR);
      }
      if (!dto.providerPaymentId || typeof dto.providerPaymentId !== "string") {
        throw new AppError(ERROR_MESSAGES.DATA_INSUFFICIANT, AppErrorCodes.VALIDATION_ERROR);
      }
      if (!dto.signature || typeof dto.signature !== "string") {
        throw new AppError(ERROR_MESSAGES.DATA_INSUFFICIANT, AppErrorCodes.VALIDATION_ERROR);
      }
      if (!dto.userId || typeof dto.userId !== "string") {
        throw new AppError(ERROR_MESSAGES.DATA_INSUFFICIANT, AppErrorCodes.VALIDATION_ERROR);
      }
      if (!dto.sessionId || typeof dto.sessionId !== "string") {
        throw new AppError(ERROR_MESSAGES.DATA_INSUFFICIANT, AppErrorCodes.VALIDATION_ERROR);
      }

      const verificationResult = await this._verifyPaymentUseCase.execute(dto);
      res.status(StatusCodes.OK).json({ data: verificationResult });
    } catch (error) {
      next(error);
    }
  }
}

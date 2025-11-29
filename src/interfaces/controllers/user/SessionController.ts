import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../../utils/http-statuscodes.js";
import ISessionListingUserUseCase from "../../../application/interfaces/ISessionListingUserUseCase.js";
import AppError from "../../../application/error/AppError.js";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants.js";
import { AppErrorCodes } from "../../../application/error/app-error-codes.js";
import ICancelSessionUserUseCase from "../../../application/interfaces/ICancelSessionUserUseCase.js";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants.js";
import ICheckSessionAccessUseCase from "../../../application/interfaces/ICheckSessionAccessUseCase.js";
import { SessionStatus } from "../../../domain/enums/SessionStatus.js";

export default class SessionController {
  constructor(
    private readonly _listSessionsByUserUseCase: ISessionListingUserUseCase,
    private readonly _cancelSessionUserUseCase: ICancelSessionUserUseCase,
    private readonly _checkSessionAccessUseCase: ICheckSessionAccessUseCase
  ) {}

  async listSessions(
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
      if (!req.pagination) {
        throw new AppError(
          ERROR_MESSAGES.INTERNAL_SERVER_ERROR,
          AppErrorCodes.INTERNAL_ERROR
        );
      }
      const userId = req.account.id;
      const result = await this._listSessionsByUserUseCase.execute({
        userId: userId!,
        status: req.query.status as
         SessionStatus,
        skip: req.pagination.skip!,
        limit: req.pagination.limit!,
      });

      res.status(StatusCodes.OK).json({ ...result });
    } catch (err) {
      next(err);
    }
  }
  async cancelSession(
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
      const { sessionId } = req.params;

      if (!sessionId) {
        throw new AppError(
          ERROR_MESSAGES.DATA_INSUFFICIANT,
          AppErrorCodes.INVALID_INPUT
        );
      }

      await this._cancelSessionUserUseCase.execute({
        sessionId,
        userId: userId!,
      });

      res
        .status(StatusCodes.OK)
        .json({ message: SUCCESS_MESSAGES.SESSION_CANCELLED });
    } catch (err) {
      next(err);
    }
  }
  async checkSessionAccess(
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
      const { sessionId } = req.params;
      const id = req.account.id;

      if (!sessionId) {
        console.warn(
          "Missing sessionId in checkSessionAccess request from:",
          sessionId
        );
        throw new AppError(
          ERROR_MESSAGES.DATA_INSUFFICIANT,
          AppErrorCodes.INVALID_INPUT
        );
      }

      const result = await this._checkSessionAccessUseCase.execute({
        sessionId,
        userId: id,
      });

      res.status(StatusCodes.OK).json({
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }
}

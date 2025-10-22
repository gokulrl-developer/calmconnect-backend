import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../../utils/http-statuscodes";
import ISessionListingPsychUseCase from "../../../application/interfaces/ISessionListingPsychUseCase";
import AppError from "../../../application/error/AppError";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants";
import { AppErrorCodes } from "../../../application/error/app-error-codes";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants";
import ICancelSessionPsychUseCase from "../../../application/interfaces/ICancelSessionPsychUseCase";
import ICheckSessionAccessUseCase from "../../../application/interfaces/ICheckSessionAccessUseCase";
import { CheckSessionAccessDTO } from "../../../application/dtos/shared.dto";
import IGetMessagesUseCase from "../../../application/interfaces/IGetMessagesUseCase";
import IPostMessageUseCase from "../../../application/interfaces/IPostMessageUseCase";

export default class SessionController {
  constructor(
    private readonly _listSessionsByPsychUseCase: ISessionListingPsychUseCase,
    private readonly _cancelSessionPsychUseCase: ICancelSessionPsychUseCase,
    private readonly _checkSessionAccessUseCase: ICheckSessionAccessUseCase,
   
  ) {}

  async listSessions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const psychId = req.account?.id;
      const result = await this._listSessionsByPsychUseCase.execute({
        psychId: psychId!,
        status: req.query.status as
          | "scheduled"
          | "completed"
          | "cancelled"
          | "available"
          | "pending",
        skip: req.pagination?.skip!,
        limit: req.pagination?.limit!,
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
      const psychId = req.account?.id;
      const { sessionId } = req.params;

      console.log(psychId, sessionId);
      if (!sessionId) {
        throw new AppError(
          ERROR_MESSAGES.DATA_INSUFFICIANT,
          AppErrorCodes.INVALID_INPUT
        );
      }
      await this._cancelSessionPsychUseCase.execute({
        sessionId,
        psychId: psychId!,
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
      const { sessionId } = req.params;
      const id = req.account?.id;

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
      
      const result = await this._checkSessionAccessUseCase.execute({ sessionId, psychId: id });

      res.status(StatusCodes.OK).json({
        ...result,
      });
    } catch (err) {
      next(err);
    }
  }

}

import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "../../../utils/http-statuscodes.js";
import ISessionListingAdminUseCase from "../../../application/interfaces/ISessionListingAdminUseCase.js";
import AppError from "../../../application/error/AppError.js";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants.js";
import { AppErrorCodes } from "../../../application/error/app-error-codes.js";
import { SessionStatus } from "../../../domain/enums/SessionStatus.js";

export default class SessionController {
  constructor(
    private readonly _listSessionsUseCase: ISessionListingAdminUseCase
  ) {}

  async listSessions(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      if(!req.pagination){
            throw new AppError(ERROR_MESSAGES.INTERNAL_SERVER_ERROR,AppErrorCodes.INTERNAL_ERROR)
           }
      const result = await this._listSessionsUseCase.execute({
        status:req.query.status as SessionStatus,
        skip: req.pagination.skip!,
        limit: req.pagination.limit!,
      });

      res.status(StatusCodes.OK).json({ ...result });
    } catch (err) {
      next(err);
    }
  }
}

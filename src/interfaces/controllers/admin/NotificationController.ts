import { Request, Response, NextFunction } from "express";
import IGetNotificationsUseCase from "../../../application/interfaces/IGetNotificationsUseCase";
import AppError from "../../../application/error/AppError";
import { ERROR_MESSAGES } from "../../../application/constants/error-messages.constants";
import { AppErrorCodes } from "../../../application/error/app-error-codes";
import { StatusCodes } from "../../../utils/http-statuscodes";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants";
import IMarkNotificationReadUseCase from "../../../application/interfaces/IMarkNotificationsReadUseCase";
import IGetUnreadNotificationsCountUseCase from "../../../application/interfaces/IGetUnreadNotificationsCountUseCase";

export default class NotificationController {
  constructor(
    private readonly _getNotificationsUseCase: IGetNotificationsUseCase,
    private readonly _markNotificationReadUseCase: IMarkNotificationReadUseCase,
    private readonly _getUnreadCountUseCase: IGetUnreadNotificationsCountUseCase
  ) {}

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skip = parseInt(req.query.skip as string) || 0;
      const limit = parseInt(req.query.limit as string) || 10;
      const recipientId = req?.account?.id;

      const {notifications,paginationData} = await this._getNotificationsUseCase.execute({
        recipientType: "admin",
        recipientId: recipientId!,
        skip,
        limit,
      });

      res.status(StatusCodes.OK).json({ notifications,paginationData });
    } catch (err) {
      next(err);
    }
  }
  async markRead(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const accountId = req?.account?.id;
      const recipientType = req?.account?.role;

      await this._markNotificationReadUseCase.execute({
      recipientType: recipientType!,
        recipientId: accountId!,
      });

      res.status(StatusCodes.OK).json({
        message: SUCCESS_MESSAGES.NOTIFICATION_MARK_READ,
      });
    } catch (err) {
      next(err);
    }
  }

  async getUnreadCount(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const accountId = req?.account?.id;
      const recipientType = req?.account?.role;

      const count=await this._getUnreadCountUseCase.execute({
        recipientType: recipientType!,
        recipientId: accountId!,
      });

      res.status(StatusCodes.OK).json({
        count,
        message: SUCCESS_MESSAGES.NOTIFICATION_COUNT_FETCHED,
      });
    } catch (err) {
      next(err);
    }
  }
}

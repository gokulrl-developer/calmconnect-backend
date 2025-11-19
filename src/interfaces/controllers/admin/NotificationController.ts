import { Request, Response, NextFunction } from "express";
import IGetNotificationsUseCase from "../../../application/interfaces/IGetNotificationsUseCase.js";
import { StatusCodes } from "../../../utils/http-statuscodes.js";
import { SUCCESS_MESSAGES } from "../../constants/success-messages.constants.js";
import IMarkNotificationReadUseCase from "../../../application/interfaces/IMarkNotificationsReadUseCase.js";
import IGetUnreadNotificationsCountUseCase from "../../../application/interfaces/IGetUnreadNotificationsCountUseCase.js";
import IClearNotificationsUseCase from "../../../application/interfaces/IClearNotificationsUseCase.js";

export default class NotificationController {
  constructor(
    private readonly _getNotificationsUseCase: IGetNotificationsUseCase,
    private readonly _markNotificationReadUseCase: IMarkNotificationReadUseCase,
    private readonly _getUnreadCountUseCase: IGetUnreadNotificationsCountUseCase,
    private readonly _clearNotificationsUseCase: IClearNotificationsUseCase
  ) {}

  async list(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const skip = req.pagination!.skip;
      const limit = req.pagination!.limit;
      const recipientId = req?.account?.id;

      const { notifications, paginationData } =
        await this._getNotificationsUseCase.execute({
          recipientType: "admin",
          recipientId: recipientId!,
          skip,
          limit,
        });

      res.status(StatusCodes.OK).json({ notifications, paginationData });
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

      const count = await this._getUnreadCountUseCase.execute({
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

  async clearNotifications(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const accountId = req?.account?.id;
      const recipientType = req?.account?.role;

      const count = await this._clearNotificationsUseCase.execute({
        recipientType: recipientType!,
        recipientId: accountId!,
      });

      res.status(StatusCodes.OK).json({
        message: SUCCESS_MESSAGES.NOTIFICATIONS_CLEARED,
      });
    } catch (err) {
      next(err);
    }
  }
}

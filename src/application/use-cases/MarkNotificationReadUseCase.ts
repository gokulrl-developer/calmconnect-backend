import { Notification } from "../../domain/entities/notification.entity";
import { INotificationRepository } from "../../domain/interfaces/INotificationRepository";
import AppError from "../error/AppError";
import { ERROR_MESSAGES } from "../constants/error-messages.constants";
import { AppErrorCodes } from "../error/app-error-codes";
import { MarkNotificationsReadDTO } from "../dtos/shared.dto";
import IMarkNotificationsReadUseCase from "../interfaces/IMarkNotificationsReadUseCase";

export default class MarkNotificationsReadUseCase
  implements IMarkNotificationsReadUseCase
{
  constructor(private readonly _notificationRepo: INotificationRepository) {}

  async execute(dto: MarkNotificationsReadDTO): Promise<void> {
    const { recipientId,recipientType } = dto;

    await this._notificationRepo.markReadByRecipient(recipientType,recipientId);

  }

}

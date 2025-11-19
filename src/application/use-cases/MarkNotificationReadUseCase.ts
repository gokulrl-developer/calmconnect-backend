import { INotificationRepository } from "../../domain/interfaces/INotificationRepository.js";
import { MarkNotificationsReadDTO } from "../dtos/shared.dto.js";
import IMarkNotificationsReadUseCase from "../interfaces/IMarkNotificationsReadUseCase.js";

export default class MarkNotificationsReadUseCase
  implements IMarkNotificationsReadUseCase
{
  constructor(private readonly _notificationRepo: INotificationRepository) {}

  async execute(dto: MarkNotificationsReadDTO): Promise<void> {
    const { recipientId,recipientType } = dto;

    await this._notificationRepo.markReadByRecipient(recipientType,recipientId);

  }

}

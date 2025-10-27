import { Notification } from "../../domain/entities/notification.entity";
import { INotificationRepository } from "../../domain/interfaces/INotificationRepository";
import ISocketService, { SendNotificationPayload } from "../../domain/interfaces/ISocketService";
import ISendNotificationUseCase from "../interfaces/ISendNotificationUseCase";

export default class SendNotificationUseCase
  implements ISendNotificationUseCase
{
  constructor(
    private readonly _notificationRepo: INotificationRepository,
    private readonly _socketService: ISocketService
  ) {}

  async execute(payload: {
    recipientType: "admin" | "user" | "psychologist";
    recipientId: string;
    title: string;
    message: string;
    type: string;
  }): Promise<Notification> {
    const notif = new Notification(
      payload.recipientId,
      payload.recipientType,
      payload.title,
      payload.message,
      payload.type,
      false,
      new Date()
    );
   
    const saved = await this._notificationRepo.create(notif);
    await this._socketService.sendToUser(payload.recipientId, saved as SendNotificationPayload);

    return saved;
  }
}

import { Notification } from "../../domain/entities/notification.entity.js";
import { NotificationRecipientType } from "../../domain/enums/NotificationRecipientType.js";

export interface SendNotificationPayload {
    recipientType:NotificationRecipientType,
    recipientId: string;
    title: string;
    message: string;
    type: string;
  }

export default interface ISendNotificationUseCase {
  execute(payload:SendNotificationPayload ): Promise<Notification>;
}

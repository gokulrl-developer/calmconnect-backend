import { Notification } from "../../domain/entities/notification.entity";

export interface SendNotificationPayload {
    recipientType:"admin"|"user"|"psychologist",
    recipientId: string;
    title: string;
    message: string;
    type: string;
  }

export default interface ISendNotificationUseCase {
  execute(payload:SendNotificationPayload ): Promise<Notification>;
}

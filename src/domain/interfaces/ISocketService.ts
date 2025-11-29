import { NotificationRecipientType } from "../enums/NotificationRecipientType.js";

export interface SendNotificationPayload{
  recipientId: string;
  recipientType:NotificationRecipientType;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  createdAt: Date;
  id: string | null;
}

export default interface ISocketService {
  initialize(): void;
  sendToUser(accountId: string, payload: SendNotificationPayload): Promise<boolean>;
}

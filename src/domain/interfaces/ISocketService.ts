export interface SendNotificationPayload{
  recipientId: string;
  recipientType:"admin"|"user"|"psychologist";
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

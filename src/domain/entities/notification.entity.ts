import { NotificationRecipientType } from "../enums/NotificationRecipientType.js";

export class Notification {
  constructor(
    public recipientId: string,
    public recipientType:NotificationRecipientType,
    public title: string,
    public message: string,
    public type: string,
    public isRead: boolean = false,
    public createdAt: Date = new Date(),
    public id?: string | null
  ) {}
}

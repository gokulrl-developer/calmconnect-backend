import { Notification } from "../entities/notification.entity.js";
import { NotificationRecipientType } from "../enums/NotificationRecipientType.js";
import IBaseRepository from "./IBaseRepository.js";

export interface INotificationRepository extends IBaseRepository<Notification> {
  findByRecipient(recipientType:NotificationRecipientType,recipientId: string ,skip?: number, limit?: number): Promise<{notifications:Notification[],totalItems:number}>;
  markReadByRecipient(recipientType:NotificationRecipientType,recipientId: string): Promise<void>;
  getUnreadCount(recipientType:NotificationRecipientType,recipientId: string):Promise<number>;
  deleteAllByAccount(recipientId:string,recipientType:NotificationRecipientType):Promise<void>;
}

import { Notification } from "../entities/notification.entity.js";
import IBaseRepository from "./IBaseRepository.js";

export interface INotificationRepository extends IBaseRepository<Notification> {
  findByRecipient(recipientType:"admin"|"user"|"psychologist",recipientId: string ,skip?: number, limit?: number): Promise<{notifications:Notification[],totalItems:number}>;
  markReadByRecipient(recipientType:"admin"|"user"|"psychologist",recipientId: string): Promise<void>;
  getUnreadCount(recipientType:"admin"|"user"|"psychologist",recipientId: string):Promise<number>;
  deleteAllByAccount(recipientId:string,recipientType:"admin"|"user"|"psychologist"):Promise<void>;
}

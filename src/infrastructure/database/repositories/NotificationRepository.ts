import { Types } from "mongoose";
import { Notification } from "../../../domain/entities/notification.entity.js";
import { BaseRepository } from "./BaseRepository.js";
import { NotificationModel, INotificationDocument } from "../models/NotificationModel.js";
import { INotificationRepository } from "../../../domain/interfaces/INotificationRepository.js";
import { NotificationRecipientType } from "../../../domain/enums/NotificationRecipientType.js";

export class NotificationRepository
  extends BaseRepository<Notification, INotificationDocument>
  implements INotificationRepository
{
  constructor() {
    super(NotificationModel);
  }

  protected toDomain(doc: INotificationDocument): Notification {
    const notif = doc.toObject();
    return new Notification(
      notif.recipientId,
      notif.recipientType,
      notif.title,
      notif.message,
      notif.type,
      notif.isRead,
      notif.createdAt,
      notif._id.toString()
    );
  }

  protected toPersistence(entity: Partial<Notification>): Partial<INotificationDocument> {
    const persistenceObj: Partial<INotificationDocument> = {};

    if (entity.recipientId) persistenceObj.recipientId = entity.recipientId;
    if (entity.recipientType) persistenceObj.recipientType = entity.recipientType;
    if (entity.title) persistenceObj.title = entity.title;
    if (entity.message) persistenceObj.message = entity.message;
    if (entity.type) persistenceObj.type = entity.type;
    if (entity.isRead !== undefined) persistenceObj.isRead = entity.isRead;
    if (entity.createdAt) persistenceObj.createdAt = entity.createdAt;
    if (entity.id) persistenceObj._id = new Types.ObjectId(entity.id);

    return persistenceObj;
  }

 async findByRecipient(
  recipientType: NotificationRecipientType,
  recipientId: string,
  skip = 0,
  limit = 50
) {
  const query= { recipientType,recipientId:recipientId}; 

  const docs = await this.model
    .find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
  const totalItems=await this.model.countDocuments(query);
  return {notifications: docs.map((doc) => this.toDomain(doc as INotificationDocument)),totalItems};
}

  async markReadByRecipient(recipientType: NotificationRecipientType,
  recipientId: string): Promise<void> {
    await this.model.updateMany(
      { recipientType:recipientType,recipientId:recipientId },
      { isRead: true }
    );
  }

async getUnreadCount(
    recipientType: NotificationRecipientType,
    recipientId: string
  ): Promise<number> {
    const count = await this.model.countDocuments({
      recipientType,
      recipientId: recipientId,
      isRead: false,
    })
    return count;
  }
  async deleteAllByAccount(
    recipientId: string,
    recipientType: NotificationRecipientType
  ): Promise<void> {
    await this.model.deleteMany({ recipientId, recipientType });
  }
}

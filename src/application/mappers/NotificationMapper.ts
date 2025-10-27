import { Notification } from "../../domain/entities/notification.entity";
import { SendNotificationPayload } from "../../domain/interfaces/ISocketService";
import { NotificationListingItem } from "../interfaces/IGetNotificationsUseCase";

export const toSendNotificationPayload = (notification: Notification): SendNotificationPayload => {
  return {
    recipientId: notification.recipientId,
    recipientType: notification.recipientType,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
    id: notification.id ?? null,
  };
};

export const toNotificationListingItem = (
  notification: Notification
): NotificationListingItem => {
  return {
    notificationId: notification.id!,
    title: notification.title,
    message: notification.message,
    type: notification.type,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  };
};
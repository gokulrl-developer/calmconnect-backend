import { Notification } from "../../domain/entities/notification.entity.js";
import { SendNotificationPayload } from "../../domain/interfaces/ISocketService.js";
import { NotificationListingItem } from "../interfaces/IGetNotificationsUseCase.js";

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
    link:notification.link ?? null,
    isRead: notification.isRead,
    createdAt: notification.createdAt,
  };
};
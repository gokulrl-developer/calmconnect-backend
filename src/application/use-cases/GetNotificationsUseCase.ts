import { Notification } from "../../domain/entities/notification.entity";
import { INotificationRepository } from "../../domain/interfaces/INotificationRepository";
import { GetNotificationsDTO } from "../dtos/shared.dto";
import IGetNotificationsUseCase, { NotificationListingItem } from "../interfaces/IGetNotificationsUseCase";
import { toNotificationListingItem } from "../mappers/NotificationMapper";
import { calculatePagination } from "../utils/calculatePagination";

export default class GetNotificationsUseCase
  implements IGetNotificationsUseCase
{
  constructor(private readonly _notificationRepo: INotificationRepository) {}

  async execute(dto: GetNotificationsDTO) {
    const { recipientType, recipientId, skip = 0, limit = 10 } = dto;
      const {notifications,totalItems}= await this._notificationRepo.findByRecipient(
        recipientType,
        recipientId,
        skip,
        limit
      );

      return {notifications:notifications.map(toNotificationListingItem),paginationData:calculatePagination(totalItems,skip,limit)}
    
  }
}

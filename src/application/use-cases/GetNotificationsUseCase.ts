import { INotificationRepository } from "../../domain/interfaces/INotificationRepository.js";
import { GetNotificationsDTO } from "../dtos/shared.dto.js";
import IGetNotificationsUseCase, { NotificationListingItem } from "../interfaces/IGetNotificationsUseCase.js";
import { toNotificationListingItem } from "../mappers/NotificationMapper.js";
import { calculatePagination } from "../utils/calculatePagination.js";

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

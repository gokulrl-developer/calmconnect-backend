import { GetNotificationsDTO } from "../dtos/shared.dto";
import PaginationData from "../utils/calculatePagination";

export interface NotificationListingItem{
    title: string,
    message: string,
    type: string,
    isRead: boolean ,
    createdAt: Date,
    notificationId: string 
}

export default interface IGetNotificationsUseCase {
  execute(dto: GetNotificationsDTO): Promise<{notifications:NotificationListingItem[],paginationData:PaginationData}>;
}

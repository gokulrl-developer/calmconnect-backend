import { INotificationRepository } from "../../domain/interfaces/INotificationRepository";
import { GetUnreadNotificationsCountDTO } from "../dtos/shared.dto";
import IGetUnreadNotificationsCountUseCase from "../interfaces/IGetUnreadNotificationsCountUseCase";

export default class GetUnreadNotificationCountUseCase implements IGetUnreadNotificationsCountUseCase{
    constructor(
        private readonly _notificationRepo:INotificationRepository
    ){}
 async execute(dto:GetUnreadNotificationsCountDTO){
    return await this._notificationRepo.getUnreadCount(dto.recipientType,dto.recipientId)
 }
}
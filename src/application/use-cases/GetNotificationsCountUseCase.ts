import { INotificationRepository } from "../../domain/interfaces/INotificationRepository.js";
import { GetUnreadNotificationsCountDTO } from "../dtos/shared.dto.js";
import IGetUnreadNotificationsCountUseCase from "../interfaces/IGetUnreadNotificationsCountUseCase.js";

export default class GetUnreadNotificationCountUseCase implements IGetUnreadNotificationsCountUseCase{
    constructor(
        private readonly _notificationRepo:INotificationRepository
    ){}
 async execute(dto:GetUnreadNotificationsCountDTO){
    return await this._notificationRepo.getUnreadCount(dto.recipientType,dto.recipientId)
 }
}
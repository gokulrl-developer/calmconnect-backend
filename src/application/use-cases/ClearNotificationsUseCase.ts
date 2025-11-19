import { INotificationRepository } from "../../domain/interfaces/INotificationRepository.js";
import { ClearNotificationsDTO } from "../dtos/shared.dto.js";
import IClearNotificationsUseCase from "../interfaces/IClearNotificationsUseCase.js";

export default class ClearNotificationsUseCase implements IClearNotificationsUseCase{
  constructor(
   private readonly _notificationRepository:INotificationRepository
  ){}

  async execute(dto:ClearNotificationsDTO){
     await this._notificationRepository.deleteAllByAccount(dto.recipientId,dto.recipientType);
  }
}
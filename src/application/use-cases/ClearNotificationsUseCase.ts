import { INotificationRepository } from "../../domain/interfaces/INotificationRepository";
import { ClearNotificationsDTO } from "../dtos/shared.dto";
import IClearNotificationsUseCase from "../interfaces/IClearNotificationsUseCase";

export default class ClearNotificationsUseCase implements IClearNotificationsUseCase{
  constructor(
   private readonly _notificationRepository:INotificationRepository
  ){}

  async execute(dto:ClearNotificationsDTO){
     await this._notificationRepository.deleteAllByAccount(dto.recipientId,dto.recipientType);
  }
}
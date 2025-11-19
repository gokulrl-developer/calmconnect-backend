import { GetUnreadNotificationsCountDTO } from "../dtos/shared.dto.js";

export default interface IGetUnreadNotificationsCountUseCase{
    execute(dto:GetUnreadNotificationsCountDTO):Promise<number>;
}
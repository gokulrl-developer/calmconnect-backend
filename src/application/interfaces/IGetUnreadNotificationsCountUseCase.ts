import { GetUnreadNotificationsCountDTO } from "../dtos/shared.dto";

export default interface IGetUnreadNotificationsCountUseCase{
    execute(dto:GetUnreadNotificationsCountDTO):Promise<number>;
}
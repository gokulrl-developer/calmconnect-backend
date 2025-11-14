import { ClearNotificationsDTO } from "../dtos/shared.dto";

export default interface IClearNotificationsUseCase{
    execute(dto:ClearNotificationsDTO):Promise<void>;
}
import { ClearNotificationsDTO } from "../dtos/shared.dto.js";

export default interface IClearNotificationsUseCase{
    execute(dto:ClearNotificationsDTO):Promise<void>;
}
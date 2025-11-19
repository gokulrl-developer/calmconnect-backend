import { DeleteQuickSlotDTO } from "../dtos/psych.dto.js";

export default interface IDeleteQuickSlotUseCase{
    execute(dto:DeleteQuickSlotDTO):Promise<void>
}
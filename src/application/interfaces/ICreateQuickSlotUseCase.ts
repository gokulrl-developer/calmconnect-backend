import { CreateQuickSlotDTO } from "../dtos/psych.dto.js";

export default interface ICreateQuickSlotUseCase{
    execute(dto:CreateQuickSlotDTO):Promise<void>
}
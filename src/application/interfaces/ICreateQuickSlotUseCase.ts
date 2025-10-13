import { CreateQuickSlotDTO } from "../dtos/psych.dto";

export default interface ICreateQuickSlotUseCase{
    execute(dto:CreateQuickSlotDTO):Promise<void>
}
import { DeleteQuickSlotDTO } from "../dtos/psych.dto";

export default interface IDeleteQuickSlotUseCase{
    execute(dto:DeleteQuickSlotDTO):Promise<void>
}
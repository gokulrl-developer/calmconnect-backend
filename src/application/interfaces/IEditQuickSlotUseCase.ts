import { EditQuickSlotDTO } from "../dtos/psych.dto.js";

export default interface IEditQuickSlotUseCase{
    execute(dto:EditQuickSlotDTO):Promise<void>
}
import { EditQuickSlotDTO } from "../dtos/psych.dto";

export default interface IEditQuickSlotUseCase{
    execute(dto:EditQuickSlotDTO):Promise<void>
}
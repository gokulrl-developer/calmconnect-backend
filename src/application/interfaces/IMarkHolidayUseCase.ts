import { MarkHolidayDTO } from "../../domain/dtos/psych.dto";

export default interface IMarkHolidayUseCase{
    execute(dto:MarkHolidayDTO):Promise<void>
}
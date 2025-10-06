import { MarkHolidayDTO } from "../dtos/psych.dto";

export default interface IMarkHolidayUseCase{
    execute(dto:MarkHolidayDTO):Promise<void>
}
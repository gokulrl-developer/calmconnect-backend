import { DeleteHolidayDTO } from "../../domain/dtos/psych.dto";

export default interface IDeleteHolidayUseCase{
    execute(dto:DeleteHolidayDTO):Promise<void>
}
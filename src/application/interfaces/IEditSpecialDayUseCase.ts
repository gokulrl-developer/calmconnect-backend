import { EditSpecialDayDTO } from "../dtos/psych.dto";

export default interface IEditSpecialDayUseCase{
    execute(dto:EditSpecialDayDTO):Promise<void>
}
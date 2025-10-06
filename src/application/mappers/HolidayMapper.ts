import { MarkHolidayDTO } from "../dtos/psych.dto";
import Holiday from "../../domain/entities/holiday.entity";

export const toHolidayDomainMapper=(dto:MarkHolidayDTO)=>{
    return new Holiday(
     dto.psychId,
     new Date(dto.date),
     dto.availableSlots
    )
}
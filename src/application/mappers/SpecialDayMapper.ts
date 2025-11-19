import SpecialDay from "../../domain/entities/special-day.entity.js";
import { CreateSpecialDayDTO, EditSpecialDayDTO,  } from "../dtos/psych.dto.js";

export const mapCreateSpecialDayDTOToDomain=(dto:CreateSpecialDayDTO)=>{
    return new SpecialDay(
        dto.psychId,
        new Date(dto.date),
        dto.type,
        dto.startTime?new Date(dto.startTime):undefined,
        dto.endTime?new Date(dto.endTime):undefined,
        dto.durationInMins??undefined,
        dto.bufferTimeInMins??0,
        "active",
        undefined
    )
}

export const mapEditSpecialDayDTOToDomain=(dto:EditSpecialDayDTO,specialDay:SpecialDay)=>{
    return new SpecialDay(
        dto.psychId,
        new Date(specialDay.date),
        dto.type??specialDay.type,
        (dto.type==="override"?(dto.startTime?new Date(dto.startTime):specialDay.startTime):undefined),
        (dto.type==="override"?(dto.endTime?new Date(dto.endTime):specialDay.endTime):undefined),
        (dto.type==="override"?(dto.durationInMins?dto.durationInMins:specialDay.durationInMins):undefined),
        (dto.type==="override"?(dto.bufferTimeInMins?dto.bufferTimeInMins:(specialDay.bufferTimeInMins??0)):undefined),
        dto.status??specialDay.status,
        dto.specialDayId
    )
}

export const mapDomainToDailySpecialDay=(specialDay:SpecialDay)=>{
    return {
        type:specialDay.type,
        startTime:specialDay.startTime?.toISOString(),
        endTime:specialDay.endTime?.toISOString(),
        durationInMins:specialDay.durationInMins,
        bufferTimeInMins:specialDay.bufferTimeInMins,
        status:specialDay.status,
        specialDayId:specialDay.id!
    }
}
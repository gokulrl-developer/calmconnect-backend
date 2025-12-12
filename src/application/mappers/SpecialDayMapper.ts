import SpecialDay from "../../domain/entities/special-day.entity.js";
import { SpecialDayStatus } from "../../domain/enums/SpecialDayStatus.js";
import { SpecialDayType } from "../../domain/enums/SpecialDayType.js";
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
        SpecialDayStatus.ACTIVE,
        undefined
    )
}

export const mapEditSpecialDayDTOToDomain=(dto:EditSpecialDayDTO,specialDay:SpecialDay)=>{
    return new SpecialDay(
        dto.psychId,
        new Date(specialDay.date),
        dto.type??specialDay.type,
        (dto.type===SpecialDayType.OVERRIDE?(dto.startTime?new Date(dto.startTime):specialDay.startTime):undefined),
        (dto.type===SpecialDayType.OVERRIDE?(dto.endTime?new Date(dto.endTime):specialDay.endTime):undefined),
        (dto.type===SpecialDayType.OVERRIDE?(dto.durationInMins??specialDay.durationInMins):undefined),
        (dto.type===SpecialDayType.OVERRIDE?(dto.bufferTimeInMins??(specialDay.bufferTimeInMins??0)):undefined),
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
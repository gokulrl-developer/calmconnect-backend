import QuickSlot from "../../domain/entities/quick-slot.entity.js";
import { CreateQuickSlotDTO, EditQuickSlotDTO } from "../dtos/psych.dto.js";

export const mapCreateQuickSlotDTOToDomain=(dto:CreateQuickSlotDTO)=>{
    return new QuickSlot(
       dto.psychId,
       new Date(dto.date),
       new Date(dto.startTime),
       new Date(dto.endTime),
       dto.durationInMins,
       dto.bufferTimeInMins??0,
       "active",
       undefined      
    )
}

export const mapEditQuickSlotDTOToDomain=(dto:EditQuickSlotDTO,quickSlot:QuickSlot)=>{
    return new QuickSlot(
       dto.psychId,
       quickSlot.date,
       dto.startTime?new Date(dto.startTime):quickSlot.startTime,
       dto.endTime?new Date(dto.endTime):quickSlot.endTime,
       dto.durationInMins??quickSlot.durationInMins,
       dto.bufferTimeInMins??quickSlot.bufferTimeInMins,
       dto.status??quickSlot.status,
       dto.quickSlotId      
    )
}

export const mapDomainToDailyQuickSlot=(quickSlot:QuickSlot)=>{
    return {
    startTime: quickSlot.startTime.toISOString(), 
    endTime: quickSlot.endTime.toISOString(), 
    durationInMins: quickSlot.durationInMins, // slot duration
    bufferTimeInMins: quickSlot.bufferTimeInMins, // optional buffer
    status: quickSlot.status,
    quickSlotId:quickSlot.id! 
    }
}
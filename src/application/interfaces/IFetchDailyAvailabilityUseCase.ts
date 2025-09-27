import { DailyAvailabilityDTO} from "../../domain/dtos/psych.dto";

export interface AvailabilityInDay{
    availableSlots:{
        startTime:string,
        quick:boolean,
        endTime:string
    }[]
}

export default interface IFetchDailyAvailabilityUseCase{
    execute(dto:DailyAvailabilityDTO):Promise<AvailabilityInDay>
}
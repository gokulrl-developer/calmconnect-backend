import { FetchAvailabilityRule } from "../dtos/psych.dto.js";

export interface AvailabilityRuleDetails{
    weekDay:number,
    startTime:string,
    endTime:string,
    durationInMins:number,
    bufferTimeInMins:number,
    status:"active"|"inactive",
    availabilityRuleId:string
}
export default interface IFetchAvailabilityRuleUseCase{
    execute(dto:FetchAvailabilityRule):Promise<AvailabilityRuleDetails>
}
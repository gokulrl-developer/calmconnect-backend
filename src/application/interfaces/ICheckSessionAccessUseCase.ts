import { CheckSessionAccessDTO } from "../dtos/shared.dto"

export interface SessionAccessPayload{
    allowed:boolean,
    reason?:string,
    session?:SessionDetailsInVideoCall
}

export interface SessionDetailsInVideoCall{
 psychologist:string,
 user:string,
 startTime:Date,
 endTime:Date,
 durationInMins:number,
 sessionId:string
}

export default interface ICheckSessionAccessUseCase{
    execute(dto:CheckSessionAccessDTO):Promise<SessionAccessPayload>
}
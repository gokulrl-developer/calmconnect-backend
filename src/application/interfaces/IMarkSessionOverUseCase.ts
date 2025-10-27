export interface MarkSessionOverPayload{
  sessionId:string
}

export default interface IMarkSessionOverUseCase{
    execute(payload:MarkSessionOverPayload):Promise<void>
}
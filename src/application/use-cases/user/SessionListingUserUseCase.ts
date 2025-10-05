import { SessionListingDTO } from "../../../domain/dtos/user.dto";
import Session from "../../../domain/entities/session.entity";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import ISessionListingUserUseCase from "../../interfaces/ISessionListingUserUseCase";
import { toSessionListingUserResponse } from "../../mappers/SessionMapper";

export default class SessionListingUserUseCase implements ISessionListingUserUseCase{
    constructor(
      private readonly _sessionRepository:ISessionRepository,
      private readonly _psychRepository:IPsychRepository,
    ){}
    async execute(dto:SessionListingDTO){
       const sessions=await this._sessionRepository.listSessionsByUser(dto.userId);
       const results = await Promise.all(
  sessions.map(async (session) => {
    const psych = await this._psychRepository.findById(session.psychologist);
    return toSessionListingUserResponse(session, psych?.firstName+" "+psych?.lastName);
  })
)
  return results;  
}

}
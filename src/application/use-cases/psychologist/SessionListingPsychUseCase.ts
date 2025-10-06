import { SessionListingDTO } from "../../dtos/psych.dto";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import ISessionListingPsychUseCase from "../../interfaces/ISessionListingPsychUseCase";
import { toSessionListingPsychResponse } from "../../mappers/SessionMapper";


export default class SessionListingPsychUseCase implements ISessionListingPsychUseCase{
    constructor(
      private readonly _sessionRepository:ISessionRepository,
      private readonly _userRepository:IUserRepository,
    ){}
    async execute(dto:SessionListingDTO){
       const sessions=await this._sessionRepository.listSessionsByUser(dto.psychId);
       const results = await Promise.all(
  sessions.map(async (session) => {
    const user = await this._userRepository.findById(session.psychologist);
    return toSessionListingPsychResponse(session, user?.firstName+" "+user?.lastName);
  })
)
  return results;  
}

}
import { SessionListingDTO } from "../../dtos/admin.dto";
import IPsychRepository from "../../../domain/interfaces/IPsychRepository";
import ISessionRepository from "../../../domain/interfaces/ISessionRepository";
import IUserRepository from "../../../domain/interfaces/IUserRepository";
import ISessionListingAdminUseCase from "../../interfaces/ISessionListingAdminUseCase";
import { toSessionListingAdminResponse } from "../../mappers/SessionMapper";


export default class SessionListingAdminUseCase implements ISessionListingAdminUseCase{
    constructor(
      private readonly _sessionRepository:ISessionRepository,
      private readonly _userRepository:IUserRepository,
      private readonly _psychRepository:IPsychRepository,
    ){}
    async execute(dto:SessionListingDTO){
       const sessions=await this._sessionRepository.listSessionsByUser(dto.status);
       const results = await Promise.all(
  sessions.map(async (session) => {
    const user = await this._userRepository.findById(session.psychologist);
    const psych = await this._psychRepository.findById(session.user);
    return toSessionListingAdminResponse(session, psych?.firstName+" "+psych?.lastName,user?.firstName+" "+user?.lastName);
  })
)
  return results;  
}

}
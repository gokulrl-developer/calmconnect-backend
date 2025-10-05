import Session from "../../domain/entities/session.entity"

export const toSessionListingUserResponse=(session:Session,psychologist:string)=>{
  return {
       psychologist:psychologist,
       startTime:session.startTime,
       durationInMins:session.durationInMins,
       status:session.status,
       fees:session.fees, 
       sessionId:session.id!
  }
}
export const toSessionListingPsychResponse=(session:Session,user:string)=>{
  return {
       user:user,
       startTime:session.startTime,
       durationInMins:session.durationInMins,
       status:session.status,
       fees:session.fees, 
       sessionId:session.id!
  }
}
export const toSessionListingAdminResponse=(session:Session,psych:string,user:string)=>{
  return {
       user:user,
       psych:psych,
       startTime:session.startTime,
       durationInMins:session.durationInMins,
       status:session.status,
       fees:session.fees, 
       sessionId:session.id!
  }
}
import { PsychSignUpDTO } from "../../domain/dtos/psych.dto"
import Psychologist from "../../domain/entities/psychologist.entity"

export const toPsychDomainRegister=(psych:PsychSignUpDTO ):Psychologist=>{
  
  return new Psychologist(
    psych.firstName,
    psych.lastName,
    psych.email,
    false,
    false,
    0,
    undefined,
    psych.password,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    false,
    undefined    
  )
}

export interface FromGoogleAuthService{
  firstName:string,
  lastName:string,
  email:string,
  googleId:string
}

export const toPsychDomainSocialAuth=(psych:FromGoogleAuthService ):Psychologist=>{
  
  return new Psychologist(
    psych.firstName,
    psych.lastName,
    psych.email,
    false,
    false,
    0,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    true,
    psych.googleId    
  )
}

export const toLoginResponse = (psych: Psychologist, accessToken: string,refreshToken:string) => ({
  psych: {
    id: psych.id!,
    firstName: psych.firstName,
    lastName: psych.lastName,
    isVerified:psych.isVerified
  },
  accessToken,
  refreshToken
});
export const toGoogleAuthResponse = (psych: Psychologist, accessToken: string,refreshToken:string) => ({
  psych: {
    id: psych.id!,
    firstName: psych.firstName,
    lastName: psych.lastName,
    isVerified:psych.isVerified
  },
  accessToken,
  refreshToken
});

export const toCheckStatusResponse=(psych:Psychologist)=>{
  return{
    isVerified:psych.isVerified
  }
}

export const toAdminPsychListResponse=(psych:Psychologist)=>{
  return{  
    id:psych.id,
    firstName:psych.firstName,
    lastName:psych.lastName,
  email:psych.email,
  status:!psych.isBlocked?"active":"inactive"
  }

}
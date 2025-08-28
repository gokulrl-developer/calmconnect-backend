import { UserSignUpDTO } from "../../domain/dtos/user.dto"
import User, { UserRawDatabase } from "../../domain/entities/user.entity"


export const toUserDomainRegister=(user:UserSignUpDTO):User=>{
  
  return new User(
     user.firstName,
     user.lastName,
     user.email,
     false,
     0,
     user.password,
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

export const toUserDomainGoogleAuth=(user:FromGoogleAuthService ):User=>{
  
  return new User(
     user.firstName,
     user.lastName,
     user.email,
     false,
     0,
     undefined, 
     undefined,
     undefined,
     undefined,
     undefined,
     undefined,
     undefined,
     true,
     user.googleId

  )
}

export const toUserDomain=(user:UserRawDatabase):User=>{
  
  return new User(
     user.firstName,
     user.lastName,
     user.email,
     user.isBlocked,
     user.walletBalance,
     user.password?? undefined,
     user.id, 
     user.createdAt??undefined,
     user.gender??undefined,
     user.dob??undefined,
     user.profilePicture??undefined,
     user.address??undefined,
     user.isGoogleUser,
     user.googleId??undefined
  )
}

export const toLoginResponse = (user: User, accessToken: string,refreshToken:string) =>{
  return {
  user: {
    id: user.id!,
    firstName: user.firstName,
    lastName: user.lastName
  },
  accessToken,
  refreshToken
}
}

export const toAdminUserListResponse=(user:User)=>{
  return{  
    id:user.id,
    firstName:user.firstName,
    lastName:user.lastName,
  email:user.email,
  status:!user.isBlocked?"active":"inactive"
  }

}




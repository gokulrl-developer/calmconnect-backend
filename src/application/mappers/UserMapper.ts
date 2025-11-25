import { UpdateUserProfileDTO, UserSignUpDTO } from "../dtos/user.dto.js";
import User from "../../domain/entities/user.entity.js";
import { UserProfile } from "../interfaces/IFetchUserProfileUseCase.js";
import { UserTrendsSummary } from "../../domain/interfaces/IUserRepository.js";
import { SummaryCardItem } from "../interfaces/IFetchDashboardSummaryCardsAdminUseCase.js";
import { AdminUserListResponseItem } from "../interfaces/IUserListUseCase.js";

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

export const toAdminUserListResponse=(user:User):AdminUserListResponseItem=>{
  return{  
    id:user.id!,
    firstName:user.firstName,
    lastName:user.lastName,
  email:user.email,
  status:!user.isBlocked?"active":"inactive"
  }

}

export const toFetchUserProfileResponse = (user: User): UserProfile => ({
    firstName: user.firstName,
    lastName: user.lastName,
    email: user.email,
    gender: user.gender ?? "",
    dob: user.dob!, 
    profilePicture: user.profilePicture ?? "",
    address: user.address ?? "",
});

export const toUserDomainFromUpdateDTO = (
  existingUser: User,
  dto: Omit<UpdateUserProfileDTO, "userId"> & { profilePictureUrl?: string }
): User => {
  return new User(
    dto.firstName??existingUser.firstName,
    dto.lastName??existingUser.lastName,
    existingUser.email,
    existingUser.isBlocked,
    existingUser.walletBalance,
    existingUser.password,
    existingUser.id,
    existingUser.createdAt,
    dto.gender??existingUser.gender,
    dto.dob??existingUser.dob,
    dto.profilePictureUrl ?? existingUser.profilePicture,
    dto.address ?? existingUser.address,
    existingUser.isGoogleUser,
    existingUser.googleId
  );
};

export const mapDomainToDetailsResponseByAdmin=(user:User)=>{
  return {
    firstName:user.firstName,
    lastName:user.lastName,
    email:user.email,
    isBlocked:user.isBlocked,
    userId:user.id!,
    gender:user.gender,
    dob:user.dob,
    profilePicture:user.profilePicture,
    address:user.address
    }
}

export const mapUserSummaryToCardItem = (summary: UserTrendsSummary): SummaryCardItem => ({
  totalValue: summary.totalValue,
  addedValue: summary.addedValue,
});









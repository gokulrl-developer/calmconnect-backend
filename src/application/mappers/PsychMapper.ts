import {
  ListPsychByUserDTO,
  PsychSignUpDTO,
} from "../../domain/dtos/psych.dto";
import { Application } from "../../domain/entities/application.entity";
import Psychologist from "../../domain/entities/psychologist.entity";
import { Slot } from "../interfaces/IPsychDetailsByUserUseCase";

export const toPsychDomainRegister = (psych: PsychSignUpDTO): Psychologist => {
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
    undefined,
    false,
    undefined
  );
};

export const toPsychologistFromApplication=(app: Application, overrides?: Partial<Psychologist>): Psychologist=> {
    return new Psychologist(
      app.firstName,
      app.lastName,
      app.email,
      overrides?.isVerified ?? false,   
      overrides?.isBlocked ?? false,    
      app.walletBalance ?? 0,
      undefined, 
      app.password, 
      app.gender,
      app.dob,
      app.profilePicture,
      app.address,
      app.languages,
      app.specializations,
      app.bio,
      app.avgRating ?? 0,
      app.hourlyFees,
      undefined, 
      overrides?.applications,
      app.licenseUrl,
      app.qualifications,
      app.createdAt,
      overrides?.isGooglePsych,
      overrides?.googleId
    );
  }
export interface FromGoogleAuthService {
  firstName: string;
  lastName: string;
  email: string;
  googleId: string;
}

export const toPsychDomainSocialAuth = (
  psych: FromGoogleAuthService
): Psychologist => {
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
    undefined,
    true,
    psych.googleId
  );
};

export const toLoginResponse = (
  psych: Psychologist,
  accessToken: string,
  refreshToken: string
) => ({
  psych: {
    id: psych.id!,
    firstName: psych.firstName,
    lastName: psych.lastName,
    isVerified: psych.isVerified,
  },
  accessToken,
  refreshToken,
});
export const toGoogleAuthResponse = (
  psych: Psychologist,
  accessToken: string,
  refreshToken: string
) => ({
  psych: {
    id: psych.id!,
    firstName: psych.firstName,
    lastName: psych.lastName,
    isVerified: psych.isVerified,
  },
  accessToken,
  refreshToken,
});

export const toCheckStatusResponse = (psych: Psychologist) => {
  return {
    isVerified: psych.isVerified,
  };
};

export const toAdminPsychListResponse = (psych: Psychologist) => {
  return {
    id: psych.id,
    firstName: psych.firstName,
    lastName: psych.lastName,
    email: psych.email,
    status: !psych.isBlocked ? "active" : "inactive",
  };
};

export const toPsychListByUserPersistence = (dto: ListPsychByUserDTO) => {
  return {
    specialization: dto.specialization ?? null,
    gender: dto.gender??null,
    language: dto.language??null,
    date: dto.date??null,
    sort: dto.sort as undefined |"a-z"|"z-a" | "price" | "rating"??"a-z", /* a-z,z-a,rating,price */
    search: dto.search??null, /* name,specializations,languages fields */
    skip: dto.skip,
    limit: dto.limit,
  };
};

export const toPsychListByUserResponse=(psych:Psychologist) =>{
  return {
    psychId:psych.id!,
    name:psych.firstName+" "+psych.lastName,
rating:psych.avgRating??null,
specializations:psych.specializations?.join(" ")?? null,
hourlyFees:psych.hourlyFees??null,
profilePicture:psych.profilePicture??null,
bio:psych.bio?? null,
qualifications:psych.qualifications?? null
  }
}

export const toPsychDetailsByUserResponse=(psych:Psychologist,slots:Slot[]) =>{
  return {
  availableSlots: slots,
  psychId: psych.id as string,
  name: psych.firstName+" "+psych.lastName,
  rating: psych.avgRating?? 0,
  specializations: psych.specializations?? [],
  bio: psych.bio??"",
  qualifications: psych.qualifications??"",
  profilePicture: psych.profilePicture??"",
  hourlyFees: psych.hourlyFees??0,
  quickSlotFees: psych.quickSlotHourlyFees??0  
}
}


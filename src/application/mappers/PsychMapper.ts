import { PsychSignUpDTO, UpdatePsychProfileDTO } from "../dtos/psych.dto";
import { Application } from "../../domain/entities/application.entity";
import Psychologist from "../../domain/entities/psychologist.entity";
import { PsychProfile } from "../interfaces/IFetchPsychProfileUseCase";
import { ListPsychByUserDTO } from "../dtos/user.dto";
import {
  ListPsychQueryByUser,
  PsychSummary,
} from "../../domain/interfaces/IPsychRepository";
import { Slot } from "../utils/generateSlots";
import { SummaryCardItem } from "../interfaces/IFetchDashboardSummaryCardsAdminUseCase";

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
    false,
    undefined
  );
};

export const toPsychologistFromApplication = (
  app: Application,
  overrides?: Partial<Psychologist>
): Psychologist => {
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
    overrides?.applications,
    app.licenseUrl,
    app.qualifications,
    app.createdAt,
    overrides?.isGooglePsych,
    overrides?.googleId
  );
};
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

export const toPsychListByUserPersistence = (
  dto: ListPsychByUserDTO
): ListPsychQueryByUser => {
  return {
    specialization: dto.specialization ?? null,
    gender: dto.gender ?? null,
    date: dto.date ?? null,
    sort:
      (dto.sort as undefined | "a-z" | "z-a" | "price" | "rating") ??
      "a-z" /* a-z,z-a,rating,price */,
    search: dto.search ?? null /* name,specializations,languages fields */,
    skip: dto.skip,
    limit: dto.limit,
  };
};

export const toPsychListByUserResponse = (psych: Psychologist) => {
  return {
    psychId: psych.id!,
    name: psych.firstName + " " + psych.lastName,
    rating: psych.avgRating ?? null,
    specializations: psych.specializations?.join(" ") ?? null,
    hourlyFees: psych.hourlyFees ?? null,
    profilePicture: psych.profilePicture ?? null,
    bio: psych.bio ?? null,
    qualifications: psych.qualifications ?? null,
  };
};

export const toPsychDetailsByUserResponse = (
  psych: Psychologist,
  slots: Slot[]
) => {
  return {
    availableSlots: slots,
    psychId: psych.id as string,
    name: psych.firstName + " " + psych.lastName,
    rating: psych.avgRating ?? 0,
    specializations: psych.specializations ?? [],
    bio: psych.bio ?? "",
    qualifications: psych.qualifications ?? "",
    profilePicture: psych.profilePicture ?? "",
    hourlyFees: psych.hourlyFees ?? 0,
  };
};

export const toFetchPsychProfileResponse = (
  psych: Psychologist
): PsychProfile => ({
  firstName: psych.firstName,
  lastName: psych.lastName,
  email: psych.email,
  gender: psych.gender ?? "",
  dob: psych.dob!.toISOString(),
  profilePicture: psych.profilePicture ?? "",
  address: psych.address ?? "",
  languages: psych.languages ?? "",
  specializations: psych.specializations ?? [],
  bio: psych.bio ?? "",
  qualifications: psych.qualifications ?? "",
  hourlyFees: psych.hourlyFees ?? null,
  quickSlotHourlyFees: null,
});

export const toPsychDomainFromUpdateDTO = (
  existingPsych: Psychologist,
  dto: UpdatePsychProfileDTO & { profilePicture?: string }
): Psychologist => {
  return new Psychologist(
    existingPsych.firstName,
    existingPsych.lastName,
    existingPsych.email,
    existingPsych.isVerified,
    existingPsych.isBlocked,
    existingPsych.walletBalance,
    existingPsych.id,
    existingPsych.password,
    existingPsych.gender,
    existingPsych.dob,
    dto.profilePicture ?? existingPsych.profilePicture,
    dto.address ?? existingPsych.address,
    dto.languages ?? existingPsych.languages,
    dto.specializations ?? existingPsych.specializations,
    dto.bio ?? existingPsych.bio,
    existingPsych.avgRating,
    dto.hourlyFees ?? existingPsych.hourlyFees,
    existingPsych.applications,
    existingPsych.licenseUrl,
    dto.qualifications ?? existingPsych.qualifications,
    existingPsych.createdAt,
    existingPsych.isGooglePsych,
    existingPsych.googleId
  );
};

export const mapDomainToDetailsResponseByAdmin = (psych: Psychologist) => {
  return {
    firstName: psych.firstName,
    lastName: psych.lastName,
    email: psych.email,
    isBlocked: psych.isBlocked,
    psychId: psych.id!,
    gender: psych.gender,
    dob: psych.dob,
    profilePicture: psych.profilePicture,
    address: psych.address,
    languages: psych.languages,
    specializations: psych.specializations,
    bio: psych.bio,
    rating: psych.avgRating,
    license: psych.licenseUrl,
    qualifications: psych.qualifications,
    createdAt: psych.createdAt,
  };
};

export const mapPsychSummaryToCardItem = (summary: PsychSummary): SummaryCardItem => ({
  totalValue: summary.totalValue,
  addedValue: summary.addedValue,
});

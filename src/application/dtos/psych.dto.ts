export interface PsychSignUpDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface PsychRegisterDTO {
  email: string;
  otp: string;
}

export interface PsychLoginDTO {
  email: string;
  password: string;
}

export interface PsychGoogleAuthDTO {
  code: string;
}

export interface PsychResendOtpDTO {
  email: string;
}

export interface PsychForgotPasswordDTO {
  email: string;
}

export interface PsychResetPasswordDTO {
  email: string;
  password: string;
  otp: string;
}

export interface PsychCheckStatusDTO {
  id: string;
}

export interface PsychApplicationDTO {
  adminId:string;
  psychId: string;
  submittedAt: Date;
  phone: string;
  gender: "male" | "female" | "others";
  dob: Date;
  profilePicture: Buffer;
  address: string;
  languages: string;
  specializations: string[];
  bio: string;
  license: Buffer;
  resume: Buffer;
  qualifications: string;
}

export interface PsychApplicationStatusDTO {
  psychId: string;
}

export interface FetchPsychProfileDTO {
  psychId: string;
}

export interface UpdatePsychProfileDTO {
  profilePicture?: string | Buffer;
  address?: string;
  languages?: string;
  specializations?: string[];
  bio?: string;
  hourlyFees?: number;
  quickSlotHourlyFees?: number;
  qualifications?: string;
}

export interface SessionListingDTO{
  psychId:string,
  status:"scheduled"|"completed"|"cancelled"|"available"|"pending",
  skip:number,
  limit:number
}

export interface CancelSessionDTO{
  psychId:string,
  sessionId:string
}

export interface CreateAvaialabilityRuleDTO {
  psychId: string;
  weekDay: number; // 0-6 0 = Sunday, 1 = Monday, ...
  startTime: string; // "09:00" (time-only)
  endTime: string; // "17:00"
  durationInMins: number; // slot duration
  bufferTimeInMins?: number; // optional buffer
}

/*  patch Edit Availability rule */
export interface EditAvaialabilityRuleDTO {
  psychId: string;
  availabilityRuleId: string;
  startTime?: string; // "09:00" (time-only)
  endTime?: string; // "17:00"
  durationInMins?: number; // slot duration
  bufferTimeInMins?: number; // optional buffer
  status?: "active" | "inactive";
}

/* Soft Delete AvailabilityRule */
export interface DeleteAvailabilityRuleDTO {
  psychId: string;
  availabilityRuleId: string;
}

export interface CreateSpecialDayDTO {
  psychId: string;
  date: Date;
  type: "override" | "absent"; //override-different schedule,absent-complete holiday
  startTime?: Date; //not needed for absent
  endTime?: Date; //not needed for absent
  durationInMins?: number; // slot duration   //not needed for absent
  bufferTimeInMins?: number; // optional buffer
}

/* Patch Edit Special Day */
export interface EditSpecialDayDTO {
  psychId: string;
  specialDayId: string;
  type?: "override" | "absent"; //override-different schedule,absent-complete holiday
  startTime?: Date;
  endTime?: Date;
  durationInMins?: number; // slot duration
  bufferTimeInMins?: number; // optional buffer
  status?: "active" | "inactive";
}

/*  Soft Delete Special Day */
export interface DeleteSpecialDayDTO {
  psychId: string;
  specialDayId: string;
}

export interface CreateQuickSlotDTO {
  psychId: string;
  date: Date;
  startTime: Date;
  endTime: Date;
  durationInMins: number; // slot duration
  bufferTimeInMins?: number; // optional buffer
}

/*  patch update of quick slot */
export interface EditQuickSlotDTO {
  psychId: string;
  quickSlotId: string;
  startTime?: Date;
  endTime?: Date;
  durationInMins?: number; // slot duration
  bufferTimeInMins?: number; // optional buffer
  status?: "active" | "inactive";
}

/* Soft Delete Quick Slot */
export interface DeleteQuickSlotDTO {
  psychId: string;
  quickSlotId: string;
}

export interface FetchAvailabilityRule {
  psychId: string;
  availabilityRuleId: string;
}

export interface ListAvailabilityRulesDTO {
  psychId: string;
}

export interface FetchDailyAvailabilityDTO {
  psychId: string;
  date: string;
}

export interface FetchLatestApplicationDTO{
  psychId:string
}

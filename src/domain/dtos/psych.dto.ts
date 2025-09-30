export interface PsychSignUpDTO{
    firstName:string,
    lastName:string,
    email:string,
    password:string,
}

export interface PsychRegisterDTO{
    email:string,
    otp:string
}

export interface PsychLoginDTO{
    email:string,
    password:string,
}

export interface PsychGoogleAuthDTO{
    code:string,
}

export interface PsychResendOtpDTO{
    email:string,
}

export interface PsychForgotPasswordDTO{
    email:string
}

export interface PsychResetPasswordDTO{
    email:string,
    password:string,
    otp:string
}

export interface PsychCheckStatusDTO{
    id:string,
}

export interface PsychApplicationDTO{
    psychId:string,
    submittedAt:Date, 
    phone:string, 
    gender:"male"|"female"|"others",
    dob:Date,
    profilePicture:Buffer,
    address:string,
    languages:string,
    specializations:string[],
    bio:string,
    license:Buffer,
    resume:Buffer,
    qualifications:string
}

export interface PsychApplicationStatusDTO{
       psychId:string
}

export interface CreateAvaialabilityRuleDTO{
   psychId:string,
   startTime:string,
   endTime:string,
   startDate:string,
   endDate:string,
   durationInMins:number,
   bufferTimeInMins:number,
   quickSlots:string[],
   specialDays:{
    weekDay:number,
    availableSlots:string[]
   }[],
   slotsOpenTime:string,
   quickSlotsReleaseWindowMins?:number
}

export interface DeleteAvailabilityRuleDTO{
  availabilityRuleId:string,
  psychId:string
}

export interface MarkHolidayDTO{
   psychId:string,
   date:string,
   availableSlots:string[]
}

export interface AvailabilityRuleDetailsDTO{
    availabilityRuleId:string,
    psychId:string
}

export interface ListAvailabilityRulesDTO{
  psychId:string
}

export interface DailyAvailabilityDTO{
    psychId:string,
    date:string
}

export interface DeleteHolidayDTO{
    psychId:string,
    date:string
}

export interface ListPsychByUserDTO{
specialization?:string,
gender?:string,
language?:string,
date?:string,
sort?:string,  /* a-z,z-a,rating,price */
search?:string /* name,specializations,languages fields */
skip:number,
limit:number
}

export interface PsychDetailsByUserDTO{
    date?:string,
    psychId:string
}

export interface FetchPsychProfileDTO{
    psychId:string
}

export interface UpdatePsychProfileDTO{
    profilePicture?:string | Buffer,
    address?:string,
    languages?:string,
    specializations?:string[],
    bio?:string,
    hourlyFees?:number,
    quickSlotHourlyFees?:number,
    qualifications?:string
}

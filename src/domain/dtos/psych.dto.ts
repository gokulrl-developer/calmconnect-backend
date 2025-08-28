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


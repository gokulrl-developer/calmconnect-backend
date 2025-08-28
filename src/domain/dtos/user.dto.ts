export interface UserSignUpDTO{
    firstName:string,
    lastName:string,
    email:string,
    password:string,
}

export interface UserRegisterDTO{
    email:string,
    otp:string
}

export interface UserLoginDTO{
    email:string,
    password:string,
}

export interface UserGoogleAuthDTO{
    code:string
}

export interface UserResendOtpDTO{
    email:string,
}

export interface UserForgotPasswordDTO{
    email:string
}

export interface UserResetPasswordDTO{
    email:string,
    password:string,
    otp:string
}

export interface UserCheckStatusDTO{
    id:string,
}
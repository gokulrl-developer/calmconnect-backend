export interface UserSignUpDTO {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
}

export interface UserRegisterDTO {
  email: string;
  otp: string;
}

export interface UserLoginDTO {
  email: string;
  password: string;
}

export interface UserGoogleAuthDTO {
  code: string;
}

export interface UserResendOtpDTO {
  email: string;
}

export interface UserForgotPasswordDTO {
  email: string;
}

export interface UserResetPasswordDTO {
  email: string;
  password: string;
  otp: string;
}

export interface UserCheckStatusDTO {
  id: string;
}

export interface FetchUserProfileDTO {
  userId: string;
}

export interface UpdateUserProfileDTO {
  userId: string;
  profilePicture?: string | Buffer;
  address?: string;
  firstName?:string;
  lastName?:string;
  gender?:"male"|"female"|"others";
  dob?:Date;
}

export interface FetchCheckoutDataDTO {
  psychId: string;
  date: string;
  startTime: string;
}

export interface CreateOrderDTO {
  userId: string;
  psychId: string;
  date: string;
  startTime: string;
}

export interface VerifyPaymentDTO {
  providerOrderId: string;   
  providerPaymentId: string; 
  signature: string;         
  userId: string;  
  sessionId:string          
}

export interface SessionListingDTO{
  userId:string,
}

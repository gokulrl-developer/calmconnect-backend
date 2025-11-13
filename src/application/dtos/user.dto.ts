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
  sessionId:string;
}

export interface SessionListingDTO{
  userId:string,
  status:"scheduled"|"cancelled"|"ended"|"pending",
  skip:number,
  limit:number
}

export interface CancelSessionDTO{
  userId:string,
  sessionId:string
}

export interface ListPsychByUserDTO {
  specialization?: string;
  gender?: string;
  date?: string;
  sort?: string /* a-z,z-a,rating,price */;
  search?: string /* name,specializations,languages fields */;
  skip: number;
  limit: number;
}

export interface PsychDetailsByUserDTO {
  date?: string;
  psychId: string;
}

export interface CreateComplaintDTO{
  userId:string;
  sessionId:string;
  description:string;
}

export interface ListComplaintsDTO{
  userId:string;
  skip:number;
  limit:number
}

export interface ComplaintDetailsDTO{
  complaintId:string
}

export interface CreateReviewDTO{
  userId:string,
  sessionId:string,
  rating:number,
  comment?:string, // max 300 characters
}

export interface ListPsychReviewsDTO{
 psychId:string;
 sort:"recent"|"top-rated";
 skip:number;
 limit:number;
}

export interface FetchUserDashboardDTO{
  userId:string;
}
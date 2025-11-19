import { FetchUserProfileDTO } from "../dtos/user.dto.js";

export interface UserProfile{
    firstName:string,
    lastName:string,
    email:string,
    gender:string,
    dob:Date,
    profilePicture:string,
    address:string,
}
export default interface IFetchUserProfileUseCase{
    execute(dto:FetchUserProfileDTO):Promise<UserProfile>
}
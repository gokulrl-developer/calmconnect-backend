import { UserDetailsByAdminDTO } from "../dtos/admin.dto";

export interface AdminUserDetails {
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  userId: string;
  gender?: "male" | "female" | "others";
  dob?: Date;
  profilePicture?: string;
  address?: string;
}

export default interface IFetchUserDetailsByAdminUseCase{
    execute(dto:UserDetailsByAdminDTO):Promise<AdminUserDetails>
}
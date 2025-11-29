import { UserGender } from "../../domain/enums/UserGender.js";
import { UserDetailsByAdminDTO } from "../dtos/admin.dto.js";

export interface AdminUserDetails {
  firstName: string;
  lastName: string;
  email: string;
  isBlocked: boolean;
  userId: string;
  gender?: UserGender;
  dob?: Date;
  profilePicture?: string;
  address?: string;
}

export default interface IFetchUserDetailsByAdminUseCase{
    execute(dto:UserDetailsByAdminDTO):Promise<AdminUserDetails>
}
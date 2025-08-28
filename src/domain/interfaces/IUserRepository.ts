import { ListUsersDTO } from "../dtos/admin.dto";
import User from "../entities/user.entity";
import IBaseRepository from "./IBaseRepository";

export default interface IUserRepository extends IBaseRepository<User>{
   findByEmail(email: string): Promise<User | null>;
  findList(dto:ListUsersDTO):Promise<User[]>;
}
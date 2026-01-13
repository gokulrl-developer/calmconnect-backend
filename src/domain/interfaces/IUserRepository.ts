import { ListUsersDTO } from "../../application/dtos/admin.dto.js";
import User from "../entities/user.entity.js";
import { UserTrendsIntervalByAdmin } from "../enums/UserTrendsIntervalByAdmin.js";
import IBaseRepository from "./IBaseRepository.js";

export interface UserTrendsEntry{
  label:string; //day/month...
  userCount:number;
}
export default interface IUserRepository extends IBaseRepository<User>{
   findByEmail(email: string): Promise<User | null>;
  findList(dto:ListUsersDTO):Promise<User[]>;
  fetchUserTrends(fromDate:Date,toDate:Date,interval:UserTrendsIntervalByAdmin):Promise<UserTrendsEntry[]>;
  fetchUserTrendsSummary(fromDate:Date,toDate:Date):Promise<UserTrendsSummary>
}

export interface UserTrendsSummary{
  totalUserCount:number;  // all time total count
  addedUserCount:number; // added value in this time range
}
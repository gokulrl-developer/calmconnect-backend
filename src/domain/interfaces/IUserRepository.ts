import { ListUsersDTO } from "../../application/dtos/admin.dto.js";
import User from "../entities/user.entity.js";
import IBaseRepository from "./IBaseRepository.js";

export interface UserTrendsEntry{
  label:string; //day/month...
  users:number;
}
export default interface IUserRepository extends IBaseRepository<User>{
   findByEmail(email: string): Promise<User | null>;
  findList(dto:ListUsersDTO):Promise<User[]>;
  fetchUserTrends(fromDate:Date,toDate:Date,interval:"day"|"month"|"year"):Promise<UserTrendsEntry[]>;
  fetchUserTrendsSummary(fromDate:Date,toDate:Date):Promise<UserTrendsSummary>
}

export interface UserTrendsSummary{
  totalValue:number;  // all time total count
  addedValue:number; // added value in this time range
}
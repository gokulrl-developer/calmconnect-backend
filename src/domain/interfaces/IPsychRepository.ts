import { ListPsychDTO } from "../../application/dtos/admin.dto.js";
import  Psychologist  from "../entities/psychologist.entity.js";
import { FetchPsychTrendsByAdminInterval } from "../enums/FetchPsychTrendsByAdminInterval.js";
import { ListPsychByUserSort } from "../enums/ListPsychByUserSort.js";
import IBaseRepository from "./IBaseRepository.js";


export default interface IPsychRepository extends IBaseRepository<Psychologist>{
    findByEmail(email: string): Promise<Psychologist | null>;
    findList(dto:ListPsychDTO):Promise<Psychologist[]>;
    listPsychByUser(query:ListPsychQueryByUser):Promise<{psychologists:Psychologist[],totalItems:number}>;
    fetchPsychTrends(fromDate:Date,toDate:Date,interval:FetchPsychTrendsByAdminInterval):Promise<PsychTrendsEntry[]>;
    fetchPsychSummary(fromDate:Date,toDate:Date):Promise<PsychSummary>
}

export interface ListPsychQueryByUser{
specialization:string |null,
gender:string|null,
date:string|null,
sort:ListPsychByUserSort,  /* a-z,z-a,rating,price */
search:string |null,                /* name,specializations,languages fields */
skip:number,
limit:number
}

export interface PsychTrendsEntry{
  label:string;                    //day/month...
  psychologists:number;
}

export interface PsychSummary{
  totalValue:number;  // all time total count
  addedValue:number; // added value in this time range
}
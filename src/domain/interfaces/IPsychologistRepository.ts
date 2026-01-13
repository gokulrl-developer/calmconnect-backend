import { ListPsychDTO } from "../../application/dtos/admin.dto.js";
import  Psychologist  from "../entities/psychologist.entity.js";
import { FetchPsychTrendsByAdminInterval } from "../enums/PsychologistTrendsInterval.js";
import { ListPsychByUserSort } from "../enums/PsychologistSortOption.js";
import IBaseRepository from "./IBaseRepository.js";


export default interface IPsychologistRepository extends IBaseRepository<Psychologist>{
    getForEmail(email: string): Promise<Psychologist | null>;
    listPsychologists(dto:ListPsychDTO):Promise<Psychologist[]>;
    listPsychologistsForUser(query:ListPsychQueryByUser):Promise<{psychologists:Psychologist[],totalItemCount:number}>;
    getTrends(fromDate:Date,toDate:Date,interval:FetchPsychTrendsByAdminInterval):Promise<PsychTrendsEntry[]>;
    getSummary(fromDate:Date,toDate:Date):Promise<PsychSummary>
}

export interface ListPsychQueryByUser{
specialization:string |null,
gender:string|null,
date:string|null,
sort:ListPsychByUserSort,  /* a-z,z-a,rating,price */
searchQuery:string |null,                /* name,specializations,languages fields */
offset:number,
limit:number
}

export interface PsychTrendsEntry{
  label:string;                    //day/month...
  psychologistCount:number;
}

export interface PsychSummary{
  totalPsychologistCount:number;  // all time total count
  addedPsychologistCount:number; // added value in this time range
}
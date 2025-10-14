import { ListPsychDTO } from "../../application/dtos/admin.dto";
import  Psychologist  from "../entities/psychologist.entity";
import IBaseRepository from "./IBaseRepository";


export default interface IPsychRepository extends IBaseRepository<Psychologist>{
    findByEmail(email: string): Promise<Psychologist | null>;
    findList(dto:ListPsychDTO):Promise<Psychologist[]>;
    listPsychByUser(query:ListPsychQueryByUser):Promise<{psychologists:Psychologist[],totalItems:number}>
}

export interface ListPsychQueryByUser{
specialization:string |null,
gender:string|null,
date:string|null,
sort:"a-z"|"z-a"|"rating"|"price",  /* a-z,z-a,rating,price */
search:string |null,/* name,specializations,languages fields */
skip:number,
limit:number
}

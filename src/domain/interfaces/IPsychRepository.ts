import { ListPsychDTO } from "../dtos/admin.dto";
import  Psychologist  from "../entities/psychologist.entity";
import IBaseRepository from "./IBaseRepository";


export default interface IPsychRepository extends IBaseRepository<Psychologist>{
    findByEmail(email: string): Promise<Psychologist | null>;
    findList(dto:ListPsychDTO):Promise<Psychologist[]>
}
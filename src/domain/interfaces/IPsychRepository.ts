import { ListPsychDTO } from "../dtos/admin.dto";
import  Psychologist  from "../entities/psychologist.entity";
import IBaseRepository from "./IBaseRepository";
import { ListPsychQueryByUser } from "./repository-types/psychologistTypes";


export default interface IPsychRepository extends IBaseRepository<Psychologist>{
    findByEmail(email: string): Promise<Psychologist | null>;
    findList(dto:ListPsychDTO):Promise<Psychologist[]>;
    listPsychByUser(query:ListPsychQueryByUser):Promise<{psychologists:Psychologist[],totalItems:number}>
}
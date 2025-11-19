import { ListPsychByUserDTO } from "../dtos/user.dto.js";
import PaginationData from "../utils/calculatePagination.js";

export interface PsychSummaryByUser{
psychId:string,
name:string,
rating:number|null,
specializations:string|null,
hourlyFees:number|null,
profilePicture:string|null,
bio:string|null,
qualifications:string|null
}

export default interface IListPsychByUserUseCase{
  execute(dto:ListPsychByUserDTO):Promise<{psychologists:PsychSummaryByUser[],paginationData:PaginationData}>
}
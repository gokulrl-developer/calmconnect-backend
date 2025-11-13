import { FetchTopPsychologistDTO } from "../dtos/admin.dto";

export interface TopPsychologistResponse {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  sessionCount: number;
  profilePicture:string;
}

export default interface IFetchTopPsychologistsUseCase {
  execute(dto: FetchTopPsychologistDTO): Promise<TopPsychologistResponse[]>;
}

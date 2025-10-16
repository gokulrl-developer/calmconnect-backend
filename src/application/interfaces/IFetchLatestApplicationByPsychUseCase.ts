import { FetchLatestApplicationDTO } from "../dtos/psych.dto";

export interface PsychApplication{
  submittedAt: Date;
  phone: string;
  gender: "male" | "female" | "others";
  dob: Date;
  profilePicture: string;
  address: string;
  languages: string;
  specializations: string[];
  bio: string;
  license: string;
  resume: string;
  qualifications: string;
  reason:string;
}
export default interface IFetchLatestApplicationByPsychUseCase{
    execute(dto:FetchLatestApplicationDTO):Promise<PsychApplication | null>
}
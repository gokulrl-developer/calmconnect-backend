import { FetchPsychProfileDTO } from "../../domain/dtos/psych.dto";

export interface PsychProfile{
    firstName: string;
    lastName: string;
    email: string;
    gender: string;
    dob: string;
    profilePicture: string;
    address: string;
    languages: string;
    specializations: string[];
    bio: string;
    qualifications: string;
    hourlyFees: number | null;
    quickSlotHourlyFees: number | null;
  };
export default interface IFetchPsychProfileUseCase{
    execute(dto:FetchPsychProfileDTO):Promise<PsychProfile>
}
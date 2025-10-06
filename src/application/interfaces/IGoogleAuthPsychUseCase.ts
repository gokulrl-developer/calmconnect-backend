import { PsychGoogleAuthDTO } from "../dtos/psych.dto";
import { LoginResponse } from "./ILoginPsychUseCase";

export interface IGoogleAuthPsychUseCase {
  execute(dto: PsychGoogleAuthDTO): Promise<LoginResponse>;
}
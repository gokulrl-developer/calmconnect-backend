import { PsychGoogleAuthDTO } from "../dtos/psych.dto.js";
import { LoginResponse } from "./ILoginPsychUseCase.js";

export interface IGoogleAuthPsychUseCase {
  execute(dto: PsychGoogleAuthDTO): Promise<LoginResponse>;
}
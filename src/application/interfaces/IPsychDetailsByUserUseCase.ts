import { PsychDetailsByUserDTO } from "../dtos/user.dto.js";

export interface Slot {
  startTime: string;
  endTime: string;
}
export interface PsychDetails {
  availableSlots: Slot[];
  psychId: string;
  name: string;
  rating: number;
  specializations: string[];
  bio: string;
  qualifications: string;
  profilePicture: string;
  hourlyFees: number;
}
export default interface IPsychDetailsByUserUseCase {
  execute(dto: PsychDetailsByUserDTO): Promise<PsychDetails>;
}

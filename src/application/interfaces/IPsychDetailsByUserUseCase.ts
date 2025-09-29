import { PsychDetailsByUserDTO } from "../../domain/dtos/psych.dto";

export interface Slot {
  startTime: string;
  endTime: string;
  quick: boolean;
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
  quickSlotFees: number;
}
export default interface IPsychDetailsByUserUseCase {
  execute(dto: PsychDetailsByUserDTO): Promise<PsychDetails>;
}

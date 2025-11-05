import { ComplaintDetailsDTO } from "../dtos/user.dto";

export interface ComplaintDetailsResponse {
  psychologistFullName: string;
  psychologistEmail: string;
  sessionId?: string;
  sessionStartTime: string;
  sessionEndTime: string;
  sessionStatus:"scheduled"|"cancelled"|"ended"|"pending",
  sessionFees:number,
  description: string;
  status: "pending" | "resolved";
  createdAt: string;
  adminNotes?: string;
  resolvedAt?: string;
}

export default interface IComplaintDetailsByUserUseCase {
  execute(dto: ComplaintDetailsDTO): Promise<ComplaintDetailsResponse>;
}

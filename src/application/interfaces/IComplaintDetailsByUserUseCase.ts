import { ComplaintStatus } from "../../domain/enums/ComplaintStatus.js";
import { SessionStatus } from "../../domain/enums/SessionStatus.js";
import { ComplaintDetailsDTO } from "../dtos/user.dto.js";

export interface ComplaintDetailsResponse {
  psychologistFullName: string;
  psychologistEmail: string;
  sessionId?: string;
  sessionStartTime: string;
  sessionEndTime: string;
  sessionStatus:SessionStatus,
  sessionFees:number,
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  adminNotes?: string;
  resolvedAt?: string;
}

export default interface IComplaintDetailsByUserUseCase {
  execute(dto: ComplaintDetailsDTO): Promise<ComplaintDetailsResponse>;
}

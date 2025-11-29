import { ComplaintStatus } from "../../domain/enums/ComplaintStatus.js";
import { SessionStatus } from "../../domain/enums/SessionStatus.js";
import { ComplaintDetailsByAdminDTO } from "../dtos/admin.dto.js";

export interface ComplaintDetailsResponse {
  userId: string;
  userFullName: string;
  userEmail: string;
  psychologistId: string;
  psychologistFullName: string;
  psychologistEmail: string;
  sessionId?: string;
  sessionStartTime: string;
  sessionEndTime: string;
  sessionStatus: SessionStatus;
  sessionFees: number;
  description: string;
  status: ComplaintStatus;
  createdAt: string;
  adminNotes?: string;
  resolvedAt?: string;
}

export default interface IComplaintDetailsByAdminUseCase {
  execute(dto: ComplaintDetailsByAdminDTO): Promise<ComplaintDetailsResponse>;
}

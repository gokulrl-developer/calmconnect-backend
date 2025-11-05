import { ComplaintDetailsByAdminDTO } from "../dtos/admin.dto";

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
  sessionStatus: "scheduled" | "cancelled" | "ended" | "pending";
  sessionFees: number;
  description: string;
  status: "pending" | "resolved";
  createdAt: string;
  adminNotes?: string;
  resolvedAt?: string;
}

export default interface IComplaintDetailsByAdminUseCase {
  execute(dto: ComplaintDetailsByAdminDTO): Promise<ComplaintDetailsResponse>;
}

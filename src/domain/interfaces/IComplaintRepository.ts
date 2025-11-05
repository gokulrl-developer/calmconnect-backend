import Complaint from "../entities/complaint.entity";
import IBaseRepository from "./IBaseRepository";

export interface ComplaintHistoryFilter{
    psychId:string;
    skip: number;
    limit: number;
}
export default interface IComplaintRepository
  extends IBaseRepository<Complaint> {
  findComplaintsByUser(
    userId: string,
    skip: number,
    limit: number
  ): Promise<{ complaints: Complaint[]; totalItems: number }>;
  findComplaintsWithSearchFilter(filter: {
    status?: string;
    search?: string; // can match user/psychologist name or email
    skip: number;
    limit: number;
  }): Promise<{ complaints: Complaint[]; totalItems: number }>;
  findComplaintsByPsychologist(filter: ComplaintHistoryFilter): Promise<{ complaints: Complaint[]; totalItems: number }>;
}

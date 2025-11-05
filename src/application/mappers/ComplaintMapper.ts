import Complaint from "../../domain/entities/complaint.entity";
import User from "../../domain/entities/user.entity";
import Psychologist from "../../domain/entities/psychologist.entity";
import Session from "../../domain/entities/session.entity";
import { CreateComplaintDTO } from "../dtos/user.dto";
import { ComplaintResolutionDTO } from "../dtos/admin.dto";
import { ComplaintListByAdminItem } from "../interfaces/IComplaintListingByAdminUseCase";
import { ComplaintDetailsResponse as AdminComplaintDetailsResponse } from "../interfaces/IComplaintDetailsByAdminUseCase";
import { ComplaintDetailsResponse as UserComplaintDetailsResponse } from "../interfaces/IComplaintDetailsByUserUseCase";
import { ComplaintListByUserItem } from "../interfaces/IComplaintListinByUserUseCase";
import { createFullName } from "../../utils/createFullName";

export const mapCreateComplaintDTOToDomain = (
  dto: CreateComplaintDTO,
  session: Session
) => {
  return new Complaint(
    dto.userId,
    session.psychologist,
    dto.sessionId,
    dto.description,
    "pending",
    new Date(),
    ""
  );
};

export const mapDomainToUserComplaintListItem = (
  complaint: Complaint,
  psychologist: Psychologist | null,
  session: Session | null
): ComplaintListByUserItem => {
  return {
    complaintId: complaint.id!,
    psychologistFullName: psychologist
      ? createFullName(psychologist.firstName, psychologist.lastName)
      : "N/A",
    psychologistEmail: psychologist?.email ?? "N/A",
    sessionId: session?.id ?? "N/A",
    status: complaint.status,
    createdAt: complaint.createdAt.toISOString(),
  };
};

export const mapDomainToUserComplaintDetails = (
  complaint: Complaint,
  psychologist: Psychologist,
  session: Session
): UserComplaintDetailsResponse => {
  return {
    psychologistFullName: `${psychologist.firstName} ${psychologist.lastName}`,
    psychologistEmail: psychologist.email,
    sessionId: session.id,
    sessionStartTime: session.startTime.toISOString(),
    sessionEndTime: session.endTime.toISOString(),
    sessionStatus:session.status,
    sessionFees:session.fees,
    description: complaint.description,
    status: complaint.status,
    createdAt: complaint.createdAt.toISOString(),
    adminNotes: complaint.adminNotes ?? undefined,
    resolvedAt: complaint.resolvedAt
      ? complaint.resolvedAt.toISOString()
      : undefined,
  };
};

export const mapDomainToAdminComplaintListItem = (
  complaint: Complaint,
  user: User | null,
  psychologist: Psychologist | null,
  session: Session | null
): ComplaintListByAdminItem => {
  return {
    complaintId: complaint.id!,
    userFullName: user ? createFullName(user.firstName, user.lastName) : "N/A",
    userEmail: user?.email ?? "N/A",
    psychologistFullName: psychologist
      ? createFullName(psychologist.firstName, psychologist.lastName)
      : "N/A",
    psychologistEmail: psychologist?.email ?? "N/A",
    sessionId: session?.id ?? "N/A",
    status: complaint.status,
    createdAt: complaint.createdAt.toISOString(),
  };
};
export const mapDomainToAdminComplainHistoryItem = (
  complaint: Complaint,
  user: User | null,
  psychologist: Psychologist | null,
  session: Session | null
): ComplaintListByAdminItem => {
  return {
    complaintId: complaint.id!,
    userFullName: user ? createFullName(user.firstName, user.lastName) : "N/A",
    userEmail: user?.email ?? "N/A",
    psychologistFullName: psychologist
      ? createFullName(psychologist.firstName, psychologist.lastName)
      : "N/A",
    psychologistEmail: psychologist?.email ?? "N/A",
    sessionId: session?.id ?? "N/A",
    status: complaint.status,
    createdAt: complaint.createdAt.toISOString(),
  };
};

export const mapDomainToAdminComplaintDetails = (
  complaint: Complaint,
  user: User,
  psychologist: Psychologist,
  session: Session
): AdminComplaintDetailsResponse => {
  return {
    userId: user.id!,
    userFullName: `${user.firstName} ${user.lastName}`,
    userEmail: user.email,
    psychologistId: psychologist.id!,
    psychologistFullName: `${psychologist.firstName} ${psychologist.lastName}`,
    psychologistEmail: psychologist.email,
    sessionId: session.id,
    sessionStartTime: session.startTime.toISOString(),
    sessionEndTime: session.endTime.toISOString(),
    sessionStatus:session.status,
    sessionFees:session.fees,
    description: complaint.description,
    status: complaint.status,
    createdAt: complaint.createdAt.toISOString(),
    adminNotes: complaint.adminNotes ?? undefined,
    resolvedAt: complaint.resolvedAt
      ? complaint.resolvedAt.toISOString()
      : undefined,
  };
};

export const mapComplaintResolutionDTOToDomain = (
  dto: ComplaintResolutionDTO,
  existingComplaint: Complaint
) => {
  return new Complaint(
    existingComplaint.user,
    existingComplaint.psychologist,
    existingComplaint.session,
    existingComplaint.description,
    "resolved",
    existingComplaint.createdAt,
    dto.adminNotes,
    existingComplaint.id,
    new Date()
  );
};

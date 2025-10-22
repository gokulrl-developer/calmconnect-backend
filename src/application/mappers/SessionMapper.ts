import Session from "../../domain/entities/session.entity";
import { SessionDetailsInVideoCall } from "../interfaces/ICheckSessionAccessUseCase";

export const toSessionListingUserResponse = (
  session: Session,
  psychFullName: string,
  psychEmail:string,
) => {
  return {
    psychFullName: psychFullName,
    psychEmail:psychEmail,
    startTime: session.startTime,
    endTime: session.endTime,
    durationInMins: session.durationInMins,
    status: session.status,
    fees: session.fees,
    sessionId: session.id!,
  };
};
export const toSessionListingPsychResponse = (
  session: Session,
  userFullName: string,
  userEmail:string
) => {
  return {
    userFullName: userFullName,
    userEmail: userEmail,
    startTime: session.startTime,
    endTime: session.endTime,
    durationInMins: session.durationInMins,
    status: session.status,
    fees: session.fees,
    sessionId: session.id!,
  };
};
export const toSessionListingAdminResponse = (
  session: Session,
  psychFullName: string,
  userFullName: string,
  psychEmail:string,
  userEmail:string
) => {
  return {
    userFullName: userFullName,
    psychFullName: psychFullName,
    userEmail:userEmail,
    psychEmail:psychEmail,
    startTime: session.startTime,
    endTime: session.endTime,
    durationInMins: session.durationInMins,
    status: session.status,
    fees: session.fees,
    sessionId: session.id!,
  };
};

export const toSessionDetailsInVideoCall = (session: Session): SessionDetailsInVideoCall => {
  return {
    psychologist: session.psychologist,
    user: session.user,
    startTime: session.startTime,
    endTime: session.endTime,
    durationInMins: session.durationInMins,
    sessionId: session.id!,
  };
};
import Session from "../../domain/entities/session.entity";

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

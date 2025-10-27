export interface EventMap {
  "application.created": { applicationId: string; psychologistEmail: string };
  "session.created": { userEmail: string; userFullName: string; psychologistId: string };
}
export interface EventMap {
  "application.created": { adminId:string;psychologistName: string; psychologistEmail: string };
  "session.created": { userEmail: string; userFullName: string; psychologistId: string };
}
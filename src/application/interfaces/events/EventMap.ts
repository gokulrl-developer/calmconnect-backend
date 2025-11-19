export interface EventMap {
  "application.created": { adminId:string;psychologistName: string; psychologistEmail: string };
  "session.created": { userEmail: string; userFullName: string; psychologistId: string };
  "complaint.raised":{complaintId:string;userFullName:string;psychologistFullName:string;sessionId:string};
  "complaint.resolved":{complaintId:string;userId:string,psychologistFullName:string}
}
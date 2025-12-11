import { EventMapEvents } from "../../../domain/enums/EventMapEvents.js";

export interface EventMap {
  [EventMapEvents.APPLICATION_CREATED]: { adminId:string;psychologistName: string; psychologistEmail: string };
  [EventMapEvents.SESSION_CREATED]: { userEmail: string; userFullName: string; psychologistId: string };
  [EventMapEvents.USER_CANCELLED_SESSION]: { userFullName: string; psychologistId: string,date:string;time:string};
  [EventMapEvents.PSYCHOLOGIST_CANCELLED_SESSION]: { psychologistFullName: string; userId: string ;date:string;time:string};
  [EventMapEvents.COMPLAINT_RAISED]:{complaintId:string;userFullName:string;psychologistFullName:string;sessionId:string};
  [EventMapEvents.COMPLAINT_RESOLVED]:{complaintId:string;userId:string,psychologistFullName:string}
}
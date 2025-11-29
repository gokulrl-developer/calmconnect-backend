import { NotificationRecipientType } from "../enums/NotificationRecipientType.js";
import { SessionQueueJob } from "../enums/SessionQueueJob.js";

export interface SessionReminderTaskPayload {
  recipientType: NotificationRecipientType;
  recipientId: string;
  sessionId: string;
  minutes: number;
  userEmail:string;
  psychEmail:string;
  userFullName:string;
  psychFullName:string;
  startTime:string;
}

export interface SessionOverTaskPayload{
  recipientType: NotificationRecipientType.USER|NotificationRecipientType.PSYCHOLOGIST;
  recipientId: string;
  sessionId:string
}

export interface SessionTaskJobMap {
  [SessionQueueJob.REMINDER_30_MINUTES]: SessionReminderTaskPayload;
  [SessionQueueJob.REMINDER_5_MINUTES]: SessionReminderTaskPayload;
  [SessionQueueJob.SESSION_OVER]: SessionOverTaskPayload;
}

export interface ISessionTaskQueue {
  add<JobName extends keyof SessionTaskJobMap>(
    jobName: JobName,
    data: SessionTaskJobMap[JobName],
    delay: number
  ): Promise<void>;
}

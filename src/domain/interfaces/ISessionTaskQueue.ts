export interface SessionReminderTaskPayload {
  recipientType: "psychologist"|"user"|"admin";
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
  recipientType: "psychologist"|"user";
  recipientId: string;
  sessionId:string
}

export interface SessionTaskJobMap {
  "session-reminder.30min": SessionReminderTaskPayload;
  "session-reminder.5min": SessionReminderTaskPayload;
  "session-over": SessionOverTaskPayload;
}


export interface ISessionTaskQueue {
  add<JobName extends keyof SessionTaskJobMap>(
    jobName: JobName,
    data: SessionTaskJobMap[JobName],
    delay: number
  ): Promise<void>;
}

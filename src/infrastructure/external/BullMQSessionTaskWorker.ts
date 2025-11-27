import { Worker, Job } from "bullmq";
import  {Redis}  from "ioredis";
import IMarkSessionOverUseCase from "../../application/interfaces/IMarkSessionOverUseCase.js";
import ISendNotificationUseCase from "../../application/interfaces/ISendNotificationUseCase.js";
import { SessionTaskJobMap } from "../../domain/interfaces/ISessionTaskQueue.js";
import { transporter } from "../config/nodeMailerConfig.js";
import { EMAIL_MESSAGES } from "../../application/constants/email-messages.constants.js";

export default class BullMQSessionTaskWorker {
  private readonly queueName = process.env.REDIS_QUEUE_NAME!;

  private worker: Worker<
    SessionTaskJobMap[keyof SessionTaskJobMap],
    void,
    keyof SessionTaskJobMap
  >;

  constructor(
    private readonly _sendNotificationUseCase: ISendNotificationUseCase,
    private readonly _markSessionOverUseCase: IMarkSessionOverUseCase,
  ) {
     const connection = new Redis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: null,
    });
    this.worker = new Worker<
      SessionTaskJobMap[keyof SessionTaskJobMap],
      void,
      keyof SessionTaskJobMap
    >(this.queueName, this.processJob.bind(this),  {
        connection
      });
    this.registerEvents();
  }

  private async processJob<JobName extends keyof SessionTaskJobMap>(
    job: Job<SessionTaskJobMap[JobName], void, JobName>
  ): Promise<void> {
    try {
      console.log("job processing reached")  
      const data = job.data;
     console.log("process",data)
      switch (job.name) {
        case "session-reminder.30min":
        case "session-reminder.5min": {
          const {
            recipientId,
            recipientType,
            minutes,
            userEmail,
            psychEmail,
            userFullName,
            psychFullName,
            startTime,
          } = data as SessionTaskJobMap["session-reminder.30min"];
          const message = `Your session starts in ${minutes} minutes.`;
          await this._sendNotificationUseCase.execute({
            recipientType,
            recipientId,
            title: "Session Reminder",
            message,
            type: "reminder",
          });
          await transporter.sendMail({
            from: `"CalmConnect" <${process.env.SMTP_EMAIL}>`,
            to: userEmail,
            subject: EMAIL_MESSAGES.SESSION_REMINDER_SUBJECT,
            html: EMAIL_MESSAGES.SESSION_REMINDER_BODY_USER(userFullName, minutes, new Date(startTime).toLocaleString()),
            text: EMAIL_MESSAGES.SESSION_REMINDER_BODY_USER_TEXT(userFullName, minutes, new Date(startTime).toLocaleString()),
          });

          await transporter.sendMail({
            from: `"CalmConnect" <${process.env.SMTP_EMAIL}>`,
            to: psychEmail,
            subject: EMAIL_MESSAGES.SESSION_REMINDER_SUBJECT,
            html: EMAIL_MESSAGES.SESSION_REMINDER_BODY_PSYCH(psychFullName, userFullName, minutes, new Date(startTime).toLocaleString()),
            text: EMAIL_MESSAGES.SESSION_REMINDER_BODY_PSYCH_TEXT(psychFullName, userFullName, minutes, new Date(startTime).toLocaleString()),
          });
          break;
        }

        case "session-over": {
          const { recipientId, recipientType, sessionId } =
            data as SessionTaskJobMap["session-over"];
          await this._markSessionOverUseCase.execute({ sessionId });
          const message = `Your session time has ended.`;
          await this._sendNotificationUseCase.execute({
            recipientType,
            recipientId,
            title: "Session Ending",
            message,
            type: "reminder",
          });
          break;
        }

        default:
          console.warn(`Unknown job name: ${job.name}`);
      }
    } catch (err) {
      console.error(`Error processing job: ${job.name}, id: ${job.id}`, err);
    }
  }

  private registerEvents(): void {
  this.worker.on("ready", () => {
    console.log("Worker is mounted and ready to process jobs");
  });

  this.worker.on("active", (job) => {
    console.log("Job started:", job.name, job.id);
  });

  this.worker.on("completed", (job) => {
    console.log(`Job completed: ${job.name}, id: ${job.id}`);
  });

  this.worker.on("failed", (job, err) => {
    console.error(
      `Job failed: ${job?.name ?? ""}, id: ${job?.id ?? ""}`,
      err
    );
  });

  this.worker.on("error", (err) => {
    console.error("Worker error:", err);
  });
}

  public async close(): Promise<void> {
    await this.worker.close();
  }
  
}

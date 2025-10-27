import { Worker, Job } from "bullmq";
import IORedis from "ioredis";
import IMarkSessionOverUseCase from "../../application/interfaces/IMarkSessionOverUseCase";
import ISendNotificationUseCase from "../../application/interfaces/ISendNotificationUseCase";
import { SessionTaskJobMap } from "../../domain/interfaces/ISessionTaskQueue";

export default class BullMQSessionTaskWorker {
  private readonly queueName = "session-task-queue";

  private worker: Worker<
    SessionTaskJobMap[keyof SessionTaskJobMap],
    void,
    keyof SessionTaskJobMap
  >;

  constructor(
    private readonly _sendNotificationUseCase: ISendNotificationUseCase,
    private readonly _markSessionOverUseCase: IMarkSessionOverUseCase,
  ) {
    const connection = new IORedis(process.env.REDIS_URL!, {
      maxRetriesPerRequest: null,
    });
    this.worker = new Worker<
      SessionTaskJobMap[keyof SessionTaskJobMap],
      void,
      keyof SessionTaskJobMap
    >(this.queueName, this.processJob.bind(this), { connection: connection });

    this.registerEvents();
  }

  private async processJob<JobName extends keyof SessionTaskJobMap>(
    job: Job<SessionTaskJobMap[JobName], void, JobName>
  ): Promise<void> {
    try {
      const data = job.data;

      switch (job.name) {
        case "session-reminder.30min":
        case "session-reminder.5min": {
          const { recipientId, recipientType, minutes } =
            data as SessionTaskJobMap["session-reminder.30min"];

          const message = `Your session starts in ${minutes} minutes.`;
          await this._sendNotificationUseCase.execute({
            recipientType,
            recipientId,
            title: "Session Reminder",
            message,
            type: "reminder",
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
    this.worker.on("completed", (job) => {
      console.log(`Job completed: ${job.name}, id: ${job.id}`);
    });

    this.worker.on("failed", (job, err) => {
      console.error(
        `Job failed: ${job?.name ?? ""}, id: ${job?.id ?? ""}`,
        err
      );
    });
  }

  public async close(): Promise<void> {
    await this.worker.close();
  }
}

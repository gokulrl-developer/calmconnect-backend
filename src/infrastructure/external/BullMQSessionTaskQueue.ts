import dotenv from "dotenv";
dotenv.config();

import { Queue } from "bullmq";
import IORedis from "ioredis";
import type {
  ISessionTaskQueue,
  SessionTaskJobMap,
} from "../../domain/interfaces/ISessionTaskQueue";

export default class BullMQSessionTaskQueue implements ISessionTaskQueue {
  private queue: Queue;

  constructor() {
    const connection = new IORedis(process.env.REDIS_URL!);
    this.queue = new Queue("session-task-queue", { connection });
  }
  async add<JobName extends keyof SessionTaskJobMap>(
    jobName: JobName,
    data: SessionTaskJobMap[JobName],
    delay: number
  ): Promise<void> {
  
    await this.queue.add(jobName, data, {
      delay,
      attempts: 3,
      removeOnComplete: true,
    });
  }
}

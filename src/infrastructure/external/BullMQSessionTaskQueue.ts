import dotenv from "dotenv";
dotenv.config();

import { Queue } from "bullmq";
import { Redis } from "ioredis";
import type {
  ISessionTaskQueue,
  SessionTaskJobMap,
} from "../../domain/interfaces/ISessionTaskQueue.js";

export default class BullMQSessionTaskQueue implements ISessionTaskQueue {
  private queue: Queue;

  constructor(
    
  ) {
   const connection = new Redis(process.env.REDIS_URL!);
    this.queue = new Queue("session-task-queue",  {
  connection
}
);
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
    await this.logAllJobs();
  }
 async logAllJobs() {
    const statuses: ("waiting" | "active" | "completed" | "failed" | "delayed")[] = [
      "waiting",
      "active",
      "completed",
      "failed",
      "delayed",
    ];

    for (const status of statuses) {
      const jobs = await this.queue.getJobs([status]);
      console.log(`\n=== Jobs with status: ${status} ===`);
      jobs.forEach((job) => {
        console.log({
          id: job.id,
          name: job.name,
          data: job.data,
          attemptsMade: job.attemptsMade,
          processedOn: job.processedOn,
          finishedOn: job.finishedOn,
          delay: job.opts.delay,
        });
      });
    }
  }

}

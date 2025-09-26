// workers/algoliaWorker.ts
import { Worker } from "bullmq";
import { Redis } from "ioredis";
const {connection} =require('../jobs/algoliaQueue')
import { addOrUpdateProduct, deleteProduct } from "../utils/algoliaSearch";

const connection = new Redis(process.env.REDIS_URL!);

const worker = new Worker(
  "algolia-sync",
  async (job) => {
    if (job.name === "addOrUpdate") {
      await addOrUpdateProduct(job.data.product);
    }

    if (job.name === "delete") {
      await deleteProduct(job.data.id);
    }
  },
  { connection }
);

worker.on("completed", (job) => {
  console.log(`✅ Job ${job.id} (${job.name}) completed`);
});

worker.on("failed", (job, err) => {
  console.error(`❌ Job ${job?.id} failed:`, err);
});

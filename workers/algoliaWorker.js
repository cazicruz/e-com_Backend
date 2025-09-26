// workers/algoliaWorker.ts
import { Worker } from "bullmq";
const IORedis = require("ioredis");
// const {connection} =require('../jobs/algoliaQueue')
import { addOrUpdateProduct, deleteProduct } from "../utils/algoliaSearch";

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_POST,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

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

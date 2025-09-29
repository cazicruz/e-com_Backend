// workers/algoliaWorker.ts
const { Worker }= reqiure("bullmq");
const IORedis = require("ioredis");
// const {connection} =require('../jobs/algoliaQueue')
const { addOrUpdateProduct, deleteProduct ,bulkDelete}= require("../utils/algoliaSearch");

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_PORT,
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

    if (job.name === "deleteMany") {
        await bulkDelete(job.data.ids);
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

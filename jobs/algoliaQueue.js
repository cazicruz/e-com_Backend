// jobs/algoliaQueue.js
const { Queue } = require("bullmq");
const IORedis = require("ioredis");

const connection = new IORedis({
  host: process.env.REDIS_HOST,
  port: process.env.REDIS_POST,
  username: process.env.REDIS_USERNAME,
  password: process.env.REDIS_PASSWORD,
});

const algoliaQueue = new Queue("algolia-sync", { connection });

module.exports = { algoliaQueue,connection };

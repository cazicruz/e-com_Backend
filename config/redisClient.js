const { createClient } = require('redis');


const redisClient = createClient({
    username:  process.env.REDIS_USERNAME,
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_POST
    }
});

redisClient.on('error', err => console.log('Redis Client Error', err));

const connectRedis = async () => {
    try {
      if (!redisClient.isOpen) {
        await redisClient.connect();
        console.log('✅ Redis connected')
      }
    } catch (err) {
      console.error('Redis connection failed:', err);
    }
  };

module.exports = { redisClient, connectRedis };

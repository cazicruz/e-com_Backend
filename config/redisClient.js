const { createClient } = require('redis');

const redisClient = createClient({
    username: 'default',
    password: 'BhVEhgzD4NkYCr8O2t6bE9up4vTzQ0YH',
    socket: {
        host: 'redis-19998.c256.us-east-1-2.ec2.redns.redis-cloud.com',
        port: 19998
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

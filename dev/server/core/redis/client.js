/* jshint esversion: 6 */
const Client = require("redis");
const redis_url = "redis://rediscloud:B4HyBRu5UbkjmoAAgR4CbH0TOMKjpk8Q@redis-16562.c2.eu-west-1-3.ec2.cloud.redislabs.com:16562";
const messages = require("./messages");

module.exports = () => {
  let redis = Client.createClient(redis_url, {
    retry_strategy: options => {
      if (options.error && options.error.code === "ECONNREFUSED") {
        console.log(new Date(), messages.redisConnectionError());
      }

      if (options.total_retry_time > 1000 * 60 * 60) {
        console.log(new Date(), messages.redisConnectionError());
      }

      if (options.attempt > 3) {
        console.log(new Date(), messages.redisConnectionError());
      }

      return Math.min(options.attempt * 100, 3000);
    }
  });

  redis.on("error", err => {
    if (err.code === "ECONNREFUSED") {
      console.log(messages.redisConnectionError(), err);
    } else {
      console.log(messages.redisOtherError(), err);
    }
  });

  redis.on("ready", () => {
    console.log("Redis is ready");
  });

  redis.on("reconnecting", () => {
    console.log("Reconnecting to redis.");
  });

  redis.on("connect", () => {
    console.log("Connected to redis.");
  });

  redis.on("end", () => {
    console.log("Connection to redis ended.");
  });

  let destroy = () => {
    redis.quit();
    redis = null;
    destroy = null;
  };

  destroy.redis = redis;

  return destroy;
};

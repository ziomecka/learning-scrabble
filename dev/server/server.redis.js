/* jshint esversion: 6 */
// import Client from "redis";
import Redis from "ioredis";
import Client from "redis";
//const redis_url = process? process.env.REDIS_URL : "redis://h:p2e369183f7f2da12e70035f77868e324f1c02537b5288e906b05b6213b0b8471@ec2-34-243-134-85.eu-west-1.compute.amazonaws.com:22839";

const redis = Client.createClient("redis://h:p2e369183f7f2da12e70035f77868e324f1c02537b5288e906b05b6213b0b8471@ec2-34-243-134-85.eu-west-1.compute.amazonaws.com:22839");
const ioredis = new Redis("redis://h:p2e369183f7f2da12e70035f77868e324f1c02537b5288e906b05b6213b0b8471@ec2-34-243-134-85.eu-west-1.compute.amazonaws.com:22839");

redis.flushdb();
module.exports.ioredis = ioredis;
module.exports.redis = redis;

/* jshint esversion: 6 */
// const Redis  = require("ioredis");
//const ioredis = new Redis(redis_url);

const Client  = require ("redis");
const UUID = require("uuid");

const redis_url = "redis://h:p15bad823b7a21c1e59a561d7bb247897f65e3982800c10198d6207864761776d@ec2-34-243-134-85.eu-west-1.compute.amazonaws.com:28329";
const redis = Client.createClient(redis_url);
const serverEvents = require("./server.events");

function myRedis () {

  const flush = () => {
    redis.flushdb();
  };

  const addUsernx = data => {
    let {login, password, socket} = data;
    redis.hsetnx(login, "login", login, (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result) {
          return addUser(data);
        } else {
          console.log(`Login ${login} already exists`);
          socket.emit("auth: login already exists");
        }
      }
    });
  };

  const addUser = data => {
    let {login, password, socket} = data;
    redis.hset(login, "password", password, (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result) {
          console.log(`User ${login} created`);
          socket.emit(serverEvents.resNewuser, {
            login: login
          });
          return login;
        } else {
          console.log(`User ${login} not created`);
          return false;
        }
      }
    });
  };

  const authorizeUser = data => {
    let {login, password, socket} = data;
    redis.exists(login, (err, result) => {
      if (err) {
        throw err;
      } else {
        if (result) {
          redis.hget(login, "password", (err, result) => {
            if (err) {
              throw err;
            } else {
              if (result === password) {
                console.log(`User ${login} authorized`);
                socket.emit(serverEvents.resAuthorizeSuccess, {
                  login: login
                });
              } else if (result !== password) {
                console.log(`Incorrect password ${login}`);
                socket.emit("auth: incorrect password");
              } else {
                // TODO???
              }
            }
          });
        } else {
          console.log(`Login ${login} does not exist`);
          socket.emit("auth: login does not exist");
        }
      }
    });
  };


  return {
    flush: flush,
    addUser: addUser,
    addUsernx: addUsernx,
    authorizeUser: authorizeUser
  };
}

module.exports.redis = myRedis();

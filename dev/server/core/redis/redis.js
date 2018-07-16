/* jshint esversion: 6 */
const getNewRedisClient = require("./client");

module.exports = () => {
  const _setKeysRedis = options => {
    let {login, keys} = Object(options);
    // TODO
    let promise = new Promise((res, rej) => {
      let destroyRedis = getNewRedisClient();

      let destroy = () => {
        destroyRedis();
        destroyRedis = null;
        destroy = null;
      }

      destroyRedis.redis.hmset(login, [...keys], (err, result) => {
        if (err) {
          destroy();
          throw err;
        }

        if (result) {
          res(login);
        } else {
          rej();
        }

        destroy();
      });
    });

    return promise;
  };

  const setKeys = options => {
    let promise = new Promise((res, rej) => {
      let {login, socket, keys} = Object(options);

      _setKeysRedis({
        "login": login,
        "keys": keys
      })
      .then(login => {
        res({
          login: login,
          socket: socket
        })
      })
      .catch(err => {
        rej(err);
      })
      .finally(() => {
        keys = null;
        socket = null;
      });
    });

    return promise;
  };

  const flush = () => {
    let destroyRedis = getNewRedisClient();

    destroyRedis.redis.flushdb();

    destroyRedis();
    destroyRedis = null;
  };

  const _getKeysRedis = options => {
    let {login, keys} = options;
    let promise = new Promise((res, rej) => {
      let destroyRedis = getNewRedisClient();
      let redis = destroyRedis.redis;
      let destroy = () => {
        destroyRedis();
        redis = null;
        destroyRedis = null;
        destroy = null;
      };

      redis.exists(login, (err, result) => {
        if (err) {
          destroy();
          throw err;
        }

        if (result) {
          /** Get the hashed password and salt. */
          redis.hmget(login, keys, (err, result) => {
            if (err) {
              destroy();
              throw err;
            }
            /** If both: hashed password and salt got. */
            res(result);
          });
        } else {
          rej();
        }

        keys = null;
        destroy();
      });
    });
    return promise;
  };

  const getKeys = options => {
    let promise = new Promise((res, rej) => {
      let {login, keys} = Object(options);

      console.log(`hmget got: ${login} ${keys}`)
      _getKeysRedis({
        "login": login,
        "keys": keys
      })
      .then(result => {
        res(result);
      })
      .catch(err => {
        rej(err);
      })
      .finally(() => {
        keys = null;
      });
    });
    return promise;
  };

  const _expireKeyRedis = options => {
    let {login, key, expire} = Object(options);
    let promise = new Promise((res, rej) => {
      /** Set custom expire field */
      setKeys({
        "login": login,
        [`${key}_expire`]: expire
      })
      .then(() => {
        res();
      })
      .catch(err => {
        rej(err);
      })
    });
    return promise;
  };

  const expireKey = options => {
    let promise = new Promise((res, rej) => {
      let {login, key, expire} = Object(options);

      _expireKeyRedis({
        "login": login,
        "key": key,
        "expire": expire
      })
      .then(result => {
        res(result);
      })
      .catch(err => {
        rej(err);
      })
      .finally(() => {
      });
    });
    return promise;
  }

  return {
    flush: flush,
    setKeysRedis: _setKeysRedis,
    setKeys: setKeys,
    getKeys: getKeys,
    expireKey: expireKey
  };
};

// const _setKeysRedisNx = options => {
//   let promise = new Promise((res, rej) => {
//     let {login, success} = options;
//
//     let redis = getNewRedisClient();
//
//     redis.hsetnx(login, "login", login, (err, result) => {
//       if (err) throw err;
//       if (result) {
//         redis.quit();
//         redis = null;
//         success();
//       } else {
//         redis.quit();
//         redis = null;
//         rej(messages.loginAlreadyExists(login));
//       }
//     });
//   });
//
//   return promise;
// };
//
// const setKeysNx = options => {
//   let promise = new Promise((res, rej) => {
//     let {login, socket, keys} = options;
//     _setKeysRedisNx({
//       "login": login,
//       "keys": keys
//     })
//     .then(login => {
//       res({
//         login: login,
//         socket: socket
//       })
//     })
//     .catch(err => {
//       rej(err);
//     })
//     .finally(() => {
//       keys = null;
//       socket = null;
//     });
//   });
//   return promise;
// };

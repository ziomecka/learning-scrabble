/* jshint esversion: 6 */
//TODO: cookie agree
//TODO: when reloaded any page -check if authrized (routing level)
//TODO: communicate that authorized by me
const sha512 = require("./authorization.password").sha512;
const salt = require("./authorization.password").generateSalt;

const messages = require("./authorization.messages");
const redis = require("../../core/redis/redis")();
const getNewRedisClient = require("../../core/redis/client");

module.exports = () => {
  const addUsernx = data => {
    // TODO inform user about changed login
    data.login = data.login.replace(/[!@#$%^&*()]/g, "");
    let login = data.login;

    let promise = new Promise((res, rej) => {
      let destroyRedis = getNewRedisClient();
      let destroy = () => {
        destroyRedis();
        destroyRedis = null;
        destroy = null;
      };

      destroyRedis.redis.hsetnx(login, "login", login, (err, result) => {
        if (err) {
          destroy();
          throw err;
        }

        if (result) {
          addUser(data)
          .then(data => {
            res({"login": login, "longNumber": data.longNumber});
          })
          .catch(err => {
            rej(err);
          });
        } else {
          rej(messages.loginAlreadyExists(login));
        }

        destroy();
      });
    });

    return promise;
  };

  const setPasswordInRedis = options => {
    return redis.setKeysRedis(options);
  };

  // const setPasswordInRedis = options => {
  //   let {login, keys} = options;
  //   let promise = new Promise((res, rej) => {
  //     let redis = getNewRedisClient();
  //
  //     redis.hmset(login, [...keys], (err, result) => {
  //       if (err) throw err;
  //       if (result) {
  //         redis.quit();
  //         redis = null;
  //         res(login);
  //       } else {
  //         redis.quit();
  //         redis = null;
  //         rej();
  //       }
  //     });
  //   });
  //   return promise;
  // };

  const refreshCookies = options => {

    let promise = new Promise((res, rej) => {
      let {login, socket} = options;
      /* Set and hash a new long number to be stored in user's cookie.*/
      const longNumber = salt();
      let hashedNumber = sha512({"password": longNumber});
      let keys = [
        "hashedNumber",
        hashedNumber.hashed,
        "saltNumber",
        hashedNumber.salt
      ];

      /** Store the new long number in redis and
      request user to set a new cookie.
      */
      setPasswordInRedis({
        "login": login,
        "keys": keys
      })
      .then(login => {
        res({
          login: login,
          longNumber: longNumber,
          socket: socket
        });
      })
      .catch(err => {
        rej(err);
      })
      .finally(() => {
        hashedNumber = null;
        keys = null;
        socket = null;
      });
    });

    return promise;
  };

  const addUser = data => {
    let {login, password} = data;
    /** Hash password. */
    let hashedPassword = sha512({"password": password});
    const longNumber = salt();
    let hashedNumber = sha512({"password": longNumber});
    let keys = [
      "hashedPassword",
      hashedPassword.hashed,
      "saltPassword",
      hashedPassword.salt,
      "hashedNumber",
      hashedNumber.hashed,
      "saltNumber",
      hashedNumber.salt
    ];

    let promise = new Promise((res, rej) => {
      setPasswordInRedis({
        "login": login,
        "keys": keys
      })
      .then(login => {
        res({"login": login, "longNumber": longNumber});
      })
      .catch(err => {
        console.log(err);
        rej(messages.userCreateFailure(login));
      })
      .finally(() => {
        keys = null;
        hashedPassword = null;
        hashedNumber = null;
      });
    });

    return promise;
  };

  /**
  *
  * @param  {[type]} data option - either:
  *                                "number" (if user is being authorized via long number stored in cookie), or
  *                                "password" (if user is being authorized via entered password)
  * @return {[type]}      [description]
  */
  const authorizeUser = data => {
    let {login, password} = data;
    let option;
    if (data.option) {
      /* Capitalize option */
      option = `${data.option[0].toUpperCase()}${data.option.slice(1).toLowerCase()}`;
    } else {
      option = "Password";
    }
    console.log(messages.authorizeOption({"login": login, "option": option}));

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
          redis.hmget(login, [`hashed${option}`, `salt${option}`], (err, result) => {
            if (err) {
              destroy()
              throw err;
            }

            /** If both: hashed password and salt got. */
            if (result[0] !== null && result[1] !== null) {
              /** Hash the password entered by the user / number from cookie */
              let enteredPasswordHashed = sha512({"password": password, "salt": result[1]}).hashed;
              /** If the hashed entered password === hashed pasword in db */
              if (enteredPasswordHashed === result[0]) {
                res(messages.authorizeSuccess(login));
              } else {
                rej(messages.authorizePasswordFailure(login));
              }
            } else {
              rej(messages.authorizeDataFailure());
            }
            destroy();
          });
        } else {
          destroy();
          rej(messages.authorizeLoginFailure(login));
        }
      });
    });
    return promise;
  };

  return {
    addUser: addUser,
    addUsernx: addUsernx,
    authorizeUser: authorizeUser,
    refreshCookies: refreshCookies
  };
};

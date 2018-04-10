/* jshint esversion: 6 */
//TODO: cookie agree
//TODO: when reloaded any page -check if authrized (routing level)
//TODO: communicate that authorized by me
const Client = require("redis");
const redis_url = "redis://h:p15bad823b7a21c1e59a561d7bb247897f65e3982800c10198d6207864761776d@ec2-34-243-134-85.eu-west-1.compute.amazonaws.com:28329";

const sha512 = require("./authorization.password").sha512;
const salt = require("./authorization.password").generateSalt;

const authorizationMessages = require("./authorization.messages");

const redis = () => {

  const flush = () => {
    let redis = Client.createClient(redis_url);
    redis.flushdb();
    redis = null;
  };

  const addUsernx = data => {
    let {login, password} = data;
    // TODO inform user about changed login
    data.login = login.replace(/[!@#$%^&*()]/g, "");
    let promise = new Promise((res, rej) => {
      let redis = Client.createClient(redis_url);
      redis.hsetnx(login, "login", login, (err, result) => {
        if (err) throw err;
        if (result) {
          redis = null;
          addUser(data)
          .then(data => res({"login": data.login, "longNumber": data.longNumber}))
          .catch(reason => rej(reason));
        } else {
          redis = null;
          rej(authorizationMessages.loginAlreadyExists(login));
        }
      });
    });

    return promise;
  };

  const setPasswordInRedis = options => {
    let {login, keys} = options;
    let promise = new Promise((res, rej) => {
      let redis = Client.createClient(redis_url);
      redis.hmset(login, [...keys], (err, result) => {
        if (err) throw err;
        if (result) {
          redis = null;
          res(login);
        } else {
          redis = null;
          rej();
        }
      });
    });
    return promise;
  };

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
      .then(login => res({login: login, longNumber: longNumber}))
      .catch(reason => rej(reason))
      .finally(() => {
        /** Collect garbage */ //TODO
        hashedNumber = null;
        keys = null;
        socket = null;
      });
    });

    return promise;
  };

  const addUser = data => {
    let {login, password, socket} = data;
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
      .then(login => res({"login": login, "longNumber": longNumber}))
      .catch(reason => rej(authorizationMessages.userCreateFailure(login)))
      .finally(() => {
        /** Collect garbage */ // TODO
        keys = null;
        hashedPassword = null;
        hashedNumber = null;
        socket = null;
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
    console.log(authorizationMessages.authorizeOption({"login": login, "option": option}));

    let promise = new Promise((res, rej) => {
      let redis = Client.createClient(redis_url);
      redis.exists(login, (err, result) => {
        if (err) throw err;
        if (result) {
          /** Get the hashed password and salt. */
          redis.hmget(login, [`hashed${option}`, `salt${option}`], (err, result) => {
            if (err) throw err;
            /** If both: hashed password and salt got. */
            if (result[0] !== null && result[1] !== null) {
              redis = null;
              /** Hash the password entered by the user / number from cookie */
              let enteredPasswordHashed = sha512({"password": password, "salt": result[1]}).hashed;
              /** If the hashed entered password === hashed pasword in db */
              if (enteredPasswordHashed === result[0]) {
                res(authorizationMessages.authorizeSuccess(login));
              } else {
                rej(authorizationMessages.authorizePasswordFailure(login));
              }
            } else {
              redis = null;
              rej(authorizationMessages.authorizeDataFailure());
            }
          });
        } else {
          redis = null;
          rej(authorizationMessages.authorizeLoginFailure(login));
        }
      });
    });
    return promise;
  };

  return {
    flush: flush,
    addUser: addUser,
    addUsernx: addUsernx,
    authorizeUser: authorizeUser,
    refreshCookies: refreshCookies
  };
};

module.exports = redis;

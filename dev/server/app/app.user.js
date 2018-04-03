/* jshint esversion: 6 */
//TODO: cookie agree
//TODO: when reloaded any page -check if authrized (routing level)
//TODO: communicate that authorized by me

const path = require("path");
const Client  = require ("redis");
const sha512  = require("./app.password").sha512;
const salt  = require("./app.password").generateSalt;

const redis_url = "redis://h:p15bad823b7a21c1e59a561d7bb247897f65e3982800c10198d6207864761776d@ec2-34-243-134-85.eu-west-1.compute.amazonaws.com:28329";
const redis = Client.createClient(redis_url);

const serverEvents = require("./app.events");
const cookiesEvents = require("../cookies/cookies.events");

function myRedis () {
  const flush = () => {
    redis.flushdb();
  };

  const addUsernx = data => {
    let {login, password, socket} = data;
    data.login = login.replace(/[!@#$%^&*()]/g, "");

    redis.hsetnx(login, "login", login, (err, result) => {
      if (err) throw err;
      if (result) {
        return addUser(data);
      } else {
        console.log(`Login: ${login} already exists.`);
        socket.emit(serverEvents.resDuplicatedLogin);
      }
    });
  };

  const setPasswordInRedis = options => {
    let {login, keys, callback: {successCallback, failureCallback}} = options;
    redis.hmset(login, [...keys], (err, result) => {
      if (err) throw err;
      if (result) {
        successCallback();
        return login;
      } else {
        failureCallback();
        // TODO socket
        return false;
      }
    });
  };

  const sendCookie = options => {
    let {event, socket, cookies, time = 60 * 60 * 24 * 7, path = "/"} = options;
    cookies.forEach(cookie => {
      cookie.time = time;
      cookie.path = path;
    });
    socket.emit(event, cookies);
  };

  const addUser = data => {
    let {login, password, socket} = data;

    /** Hash password. */
    const hashedPassword = sha512({"password": password});
    const longNumber = salt();
    // console.log("longNumber: "+ longNumber);
    const hashedNumber = sha512({"password": longNumber});

    setPasswordInRedis({
      "login": login,
      "keys": [
        "hashedPassword",
        hashedPassword.hashed,
        "saltPassword",
        hashedPassword.salt,
        "hashedNumber",
        hashedNumber.hashed,
        "saltNumber",
        hashedNumber.salt
      ],
      callback: {
        successCallback: options => {
          console.log(`User ${login} created`);
          socket.emit(serverEvents.resNewuser, {"login": login});
          sendCookie({
            "event": cookiesEvents.setAuthorizationCookies,
            "socket": socket,
            "cookies": [{
              name: "myscrabbleLogin",
              value: login
            },
            {
              name: "myscrabbleNumber",
              value: longNumber,
            }]
          });
        },
        failureCallback: () => {
          console.log(`User ${login} not created`);
        }
      }
    });
  };

  /**
   *
   * @param  {[type]} data option - either:
   *                                "number" (if user is being authorized via long number stored in cookie), or
   *                                "password" (if user is being authorized via entered password)
   * @return {[type]}      [description]
   */
  const authorizeUser = data => {
    let {login, password, socket, callbackEvent = serverEvents.resAuthorizeSuccess} = data;
    let option;
    if (data.option) {
      /* Capitalize option */
      option = `${data.option[0].toUpperCase()}${data.option.slice(1).toLowerCase()}`;
    } else {
      option = "Password";
    }
    console.log(`User being authorized via: ${option}`);

    redis.exists(login, (err, result) => {
      if (err) throw err;
      if (result) {
        /** Get the hashed password and salt. */
        redis.hmget(login, [`hashed${option}`, `salt${option}`], (err, result) => {
          if (err) throw err;
          /** If both: hashed password and salt got. */
          if (result[0] !== null && result[1] !== null) {
            /** Hash the password entered by the user / number from cookie */
            let enteredPasswordHashed = sha512({"password": password, "salt": result[1]}).hashed;
            /** If the hashed entered password === hashed pasword in db */
            if (enteredPasswordHashed === result[0]) {
              console.log(`User ${login} authorized on the basis of ${option}`);
              console.log(`I ask user to: ${callbackEvent}`);
              socket.emit(callbackEvent, {"login": login});

              /* Set and hash a new long number to be stored in user's cookie.*/
              const longNumber = salt();
              const hashedNumber = sha512({"password": longNumber});

              /* Store the new long number in redis and
                request user to set a new cookie.
                */
              setPasswordInRedis({
                "login": login,
                "keys": [
                  "hashedNumber",
                  hashedNumber.hashed,
                  "saltNumber",
                  hashedNumber.salt
                ],
                callback: {
                  successCallback: options => {
                    sendCookie({
                      "event": cookiesEvents.setAuthorizationCookies,
                      "socket": socket,
                      "cookies": [{
                        name: "myscrabbleLogin",
                        value: login
                      },
                      {
                        name: "myscrabbleNumber",
                        value: longNumber,
                      }]
                    });
                  },
                  failureCallback: () => {} //TODO
                }
              });
              /* sSend cookie with the new number */
              // sendCookie({
              //   "event": cookiesEvents.setAuthorizationCookies,
              //   "socket": socket,
              //   "cookies": [{
              //     name: "myscrabbleLogin",
              //     value: login
              //   },
              //   {
              //     name: "myscrabbleNumber",
              //     value: longNumber,
              //   }]
              // });
            } else {
              console.log(`Incorrect password ${login}`);
              socket.emit(serverEvents.resAuthorizeFailed);
              // TODO if via cookie send new cookie - NO!
            }
          } else {
            console.log(`Ups. Something went wrong. ` +
              `We suggest you...`);
            socket.emit(serverEvents.resAuthorizeFailed); // TODO change to other response
          }
        });
      } else {
        console.log(`Login ${login} does not exist`);
        socket.emit(serverEvents.resAuthorizeFailed);
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

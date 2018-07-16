/* jshint esversion: 6 */
const redis = require("../redis/redis")();

module.exports = () => {
  const setState = options => {
    return new Promise((res, rej) => {
      redis.setKeys({
        login: options.login,
        keys: [
          "state",
          options.state
        ]
      })
      .then(() => {
        redis.expireKey({
          login: options.login,
          key: "state",
          expire: options.time
        })
        .then(() => {
          res();
        })
        .catch(err => {
          rej(err);
          console.log(err);
        });
      })
      .catch(err => {
        rej(err);
        console.log(err);
      });
    // TODO catch
    })
  };

  const getState = options => {
    return new Promise((res, rej) => {
      redis.getKeys({
        login: options.login,
        keys: ["state"]
      })
      .then(result => {
        res(result);
      })
      .catch(err => {
        rej(err);
      });
    })
  };

  return {
    setState: setState,
    getState: getState
  };
};

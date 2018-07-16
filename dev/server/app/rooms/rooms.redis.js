/* jshint esversion: 6 */
const redis = require("../redis/redis")();

module.exports = () => {
  const addRoom = options => {
    return new Promise((res, rej) => {
      redis.setKeysNx({
        login: options.id,
        keys: options.keys
      })
      .then(() => {
        res();
      })
      .catch(err => {
        rej(err);
      });
    })
  };

  const getRoom = options => {
    return new Promise((res, rej) => {
      redis.getKeys({
        login: options.login,
        keys: ["state"]
      })
      .then(result => {
        res(result);
      }).
      catch(err => {
        rej(err);
      });
    })
  };

  return {
    addRoom: addRoom,
    getRoom: getRoom
  };
};

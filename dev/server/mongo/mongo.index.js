/* jshint esversion: 6 */
const mongo = require("./mongo.client");

const ensureIndex = data => {
  data = Object(data);

  mongo.client(mongo.url, (err, db) => {
    if (err) throw err;
    const dbo = db.db(mongo.name);
    let seconds = {
      minute: 60,
      hour: 3600,
      day: 86400
    };

    Object.keys(data).forEach(collection => {
      let {
        keys: keys = {_id: 1},
        background: background = true,
        unique: unique = true,
        expireAfterSeconds: expireAfterSeconds = seconds.hour * 2
      } = data[collection];
      dbo[collection]
        .ensureIndex(keys, {
          "background": background,
          "unique": unique,
          "expireAfterSeconds": expireAfterSeconds
        });
    });
  });
};

module.exports = {
  ensureIndex: ensureIndex
};

/* jshint esversion: 6 */
const mongo = require("./mongo.client");
const assert = require("assert");

const insertOne = options => {
  let {collection, object} = options;
  mongo.client.connect(mongo.url, (err, db) => {
    if (err) throw err;
    const dbo = db.db(mongo.name);
    dbo.collection(collection).insertOne(object, (err, res) => {
      console.log(`1 document inserted to ${collection}`);
      db.close();
    });
  });
};

const createCollection = options => {
  let {collection} = options;
  if (collection) {
    let validator = require(path.resolve(__dirname, "./validate", `${collection}.validator.js`));
    mongo.client.connect(mongo.url, (err, db) => {
      if (err) throw err;
      const dbo = db.db(mongo.name);
      dbo.createCollection(collection, validator, (err, res) => {
        db.close();
      });
    });
  }
};

const findOne = options => {
  let {collection, query} = options;
  if (collection) {
    mongo.client.connect(mongo.url, (err, db) => {
      if (err) throw err;
      const dbo = db.db(mongo.name);
      dbo.collection(collection).findOne(query, (err, result) => {
        if (err) throw err;
        db.close();
      });
    });
  }
};

 module.exports = {
   insertOne: insertOne,
   createCollection: createCollection,
   findOne: findOne
 };

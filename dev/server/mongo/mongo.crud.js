/* jshint esversion: 6 */
const mongo = require("./mongo.client");

const insertOne = options => {
  let {collection, object} = options;
  mongo.client.connect(mongo.url, (err, db) => {
    if (err) throw err;
    const dbo = db.db(mongo.name);
    dbo.collection(collection).insertOne(object, (err, res) => {
      if (err) throw err;
      console.log(`1 document inserted to ${collection}`);
      db.close();
    });
  });
};

 module.exports = {
   insertOne: insertOne,
 };

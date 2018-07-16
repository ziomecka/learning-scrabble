/* jshint esversion: 6 */
const mongo = require("./mongo.client");
const messages = require("./mongo.messages");
const path = require("path");

const insertOne = options => {
  return new Promise((res, rej) => {
    let {collection, object} = options;
    mongo.client.connect(mongo.url, (err, db) => {
      if (err) {
        db.close();
        rej(`${messages.errorConnection()}: ${err.message}`);
      }
      db.db(mongo.name)
      .collection(collection).insertOne(object, err => {
        if (err) {
          db.close();
          rej(`${messages.errorInsertOne()}: ${err.message}`);
        }
        console.log(messages.documentInserted());
        db.close();
        res(options.object);
      });
    });
  });
};

const createCollection = options => {
  return new Promise((res, rej) => {
    let {collection} = options;
    if (collection) {
      let validator = require(path.resolve(__dirname, "./validate", `${collection}.validator.js`));
      mongo.client.connect(mongo.url, (err, db) => {
        if (err) {
          db.close();
          rej(`${messages.errorConnection()}: ${err.message}`);
        }
        db.db(mongo.name)
        // .createCollection(collection, validator, (err) => {
        .createCollection(collection, null, (err) => {
          if (err) {
            db.close();
            rej(err.message);
          }
          db.close();
          res();
        });
      });
    }
  });
};

const findOne = options => {
  // console.log("1");
  return new Promise((res, rej) => {
    let {collection, query} = options;
    console.log("collection here 1" + collection);
    if (collection) {
      // console.log("2");
      mongo.client
      .connect(mongo.url, (err, db) => {
        if (err) {
          rej(`${messages.errorConnection()}: ${err.message}`);
        }
        // console.log("3");
        db.db(mongo.name)
        .collection(collection)
        .findOne(query, (err, result) => {
          // console.log("4");
          if (err) {
            // console.log("5");
            rej(err.message);
          }
          db.close();
          // console.log("6");
          res(result);
        });
      });
    }
  });
};

const updateOne = data => {
  return new Promise((res, rej) => {
    let {
      collection,
      query,
      update,
      options
    } = Object(data);
    if (collection) {
      mongo.client
      .connect(mongo.url, (err, db) => {
        if (err) {
          rej(`${messages.errorConnection()}: ${err.message}`);
        }
        let dbo = db.db(mongo.name);
        if (dbo.collection(collection).updateOne(query, update, options).modifiedCount === 1) {
          db.close();
          dbo = null;
          res();
        }
        else {
          db.close();
          dbo = null;
          rej(new Error("Game not updated."));
        }
      });
    }
  });
};

const getAll = options => {
  // console.log("received options: " + JSON.stringify(options));
  return new Promise((res, rej) =>{
    // console.log("0");
    let {
      collection,
      properties = ["_id"]
    } = Object(options);
    if (collection) {
      // console.log("1");
      mongo.client.connect(mongo.url, (err, db) => {
        if (err) {
          rej(`${messages.errorConnection()}: ${err.message}`);
        }
        let dbo = db.db(mongo.name);
        try {
          // console.log("2");
          dbo.collection(collection)
          .find({})
          .project({_id: 1, name: 1} )
          .map(doc => {
            return (properties = doc);
            // return {
            //   "id": doc._id,
            //   "name": doc.name
            // };
          })
          .toArray((err, result) => {
            // console.log("3");
            if (err) {
              // console.log("4");
              rej(`${messages.errorFind()}: ${err.message}`);
            }
            // console.log("5");
            // console.log(JSON.stringify(Object(result)));
            res(result);
          });
        }
        catch(err) {
          // console.log("5");
          rej(err.message);
        }
        finally {
          // console.log("6");
          db.close();
          dbo = null;
        }
      });
    }
  });
};

module.exports = {
 insertOne: insertOne,
 createCollection: createCollection,
 findOne: findOne,
 updateOne: updateOne,
 getAll: getAll
};

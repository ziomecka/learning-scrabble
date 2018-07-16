/* jshint esversion: 6 */

const MongoClient = require("mongodb").MongoClient;
const url = "mongodb://heroku_tbfsg03h:i94bkmi70celn2s63probe9hn7@ds223009.mlab.com:23009/heroku_tbfsg03h";
const dbName = "heroku_tbfsg03h";

module.exports = {
  client: MongoClient,
  url: url,
  name: dbName
};

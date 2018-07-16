/* jshint esversion: 6 */
const fs = require("fs");
const path = require("path");

const createJSON = options => {
  let {data, callback, type} = options;
  ["Polish", "English"].forEach((lang) => {
    let create = require(path.join(__dirname, type, "/create.document.js")).create;
    data[lang] = create({"lang": lang});
  });
  let opt = {
    "data": data,
    "type": type
  };
  callback(opt);
};

const createFile = options => {
  let {data, type} = options;
  fs.writeFile(`../game/assets/${type}.json`, JSON.stringify(data, null, 2), err => {
    if (err) throw err;
    console.log("The file has been saved.");
  });
};

["bags", "boards"].forEach(type => {
  createJSON({"data": {}, "type": type, "callback": createFile});
});

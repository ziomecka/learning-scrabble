/* jshint esversion: 6 */
/** Google Cloud client library. */
const Storage = require("@google-cloud/storage");
// const decrypted = require("./ckms.decrypt.online");

const download = options => {
  let {
    bucketName,
    callback,
    fileName
  } = options;

  // let storage = new Storage(decrypted());
  let storage = new Storage();

  let bucket = storage.bucket(bucketName);
  let remoteFile = bucket.file(fileName);

  remoteFile.download(callback);

  callback = null;
  storage = null;
  bucket = null;
  remoteFile = null;
};

const verify = word => {
  word = word.toLowerCase();

  const bucketName = "my-scrabble";
  const fileName = "pl.txt";

  let callback = (err, contents) =>{
    if (err) {
      console.error("Error: ", err);
      throw err;
    } else {
      let txt = contents.toString("utf-8");
      let re = new RegExp("\\b" + word + "\\r", "gi");
      let match = txt.match(re);
      let result = (match !== null && match[0] === `${word}\r`)? true : false;
      re = null;
      match = null;
      console.log(`Word "${word}" verified: ${result}.`);
      return result;
    }
  };

  download({
    "bucketName": bucketName,
    "callback": callback,
    "fileName": fileName
  });
};

// verify("dupa");
module.exports = verify;

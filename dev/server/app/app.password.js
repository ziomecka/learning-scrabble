/* jshint esversion: 6 */
const crypto = require("crypto");

const generateSalt = options => {
  options = Object(options);
  let {number = 128, string = "hex"} = options;
  return crypto.randomBytes(number).toString(string);
};

const sha512 = options => {
  let {password: password, salt: salt = generateSalt()} = options;
  const hash = crypto.createHmac("sha512", salt);
  hash.update(password);
  const hashed = hash.digest("hex");

  return {
    salt: salt,
    hashed: hashed
  };
};

module.exports = {
  sha512: sha512,
  generateSalt: generateSalt
};

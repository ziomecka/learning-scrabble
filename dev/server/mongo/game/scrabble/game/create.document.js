/* jshint esversion: 6 */
const bags = require("./assets/bags.json");
const boards = require("./assets/boards.json");

const create = options => {
  let {
    lang: lang = "Polish",
  } = Object(options);

  return {
    "bag": bags[lang],
    "board": boards[lang]
  };
};

module.exports = {
  create: create
};

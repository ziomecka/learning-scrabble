/* jshint esversion: 6 */
// const ObjectID = require("mongodb").ObjectID;
const bonuses = require("./options").bonuses;
// const findKey = require("lodash/findkey");

const setBonuses = fields => {
  Object.keys(bonuses).forEach(type => {
    bonuses[type].forEach(bonus => {
      let row = bonus[0] - 1;
      let column = bonus[1] - 1;
      fields[row][column].bonus = type;
    });
  });
  return fields;
};

const create = options => {
  options = Object(options);
  let {size: size = 15} = options;
  const fields = [];
  // const fields = [];
  // let char;
  // let id;
  // let bonus = bonuses[lang];
  // let b;
  let row;
  for (let i = 0; i < size; i++) {
    /** start from 'a' */
    row = fields[i] = [];
    // char = 97;
    for (let j = 0; j < size; j++) {
      // id = `${String.fromCharCode(char++)}${i + 1}`;
      // id = `${String.fromCharCode(char++)}${i + 1}`;
      // b = findKey(bonus, arr => arr.includes(id));
      // row[j] = {
      //   "id": id,
      //   "bonus": b,
      //   "tile": null
      // }
      row[j] = {
        "bonus": undefined,
        "tile": null
      }
      // fields[id] = {
      //   "bonus": b,
      //   "tile": null
      // };
      // fields.push({
      //   [id]: {
      //     "bonus": b,
      //     "tile": null
      //   }
      // });
    }
  }
  row = null;
  return setBonuses(fields);
};

module.exports = {
  create: create
};

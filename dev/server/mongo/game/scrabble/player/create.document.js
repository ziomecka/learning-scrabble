/* jshint esversion: 6 */
const create = options => {
  let {
    login: login,
    points: points = 0,
    time: time = 3,
    tiles: tiles = []
  } = Object(options);

  return {
    "login": login,
    "points": points,
    "time": time,
    "tiles": tiles
  };
};

module.exports = {
  create: create
};

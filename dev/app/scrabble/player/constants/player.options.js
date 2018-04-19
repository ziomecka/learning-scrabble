/* jshint esversion: 6 */
const playerOptions = {
  name: undefined,
  id: undefined,
  time: undefined
};

angular
  .module("playerModule")
  .constant("playerOptions", playerOptions);

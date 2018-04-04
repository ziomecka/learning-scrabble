/* jshint esversion: 6 */
// angular
//   .module("controlsModule")
  // .controller("controlsRoundController", [
module.exports = [
  "$scope",
  ($scope) => {
    const me = $scope;
    me.roundOK = () => {};
    me.roundExchange = () => {};
    me.roundResign = () => {};
  }
];

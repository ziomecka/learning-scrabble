/* jshint esversion: 6 */
angular
  .module("playerModule")
  .directive("playerDirective", [
    (players) => {
      let template = "";
      players.forEach((player) => {
        template += `
        <p ng-bind="{{player.points}}"></p>
        <p ng-bind="{{player.time}}"></p>
        `;
      });

      return {
        template: template
      };
    }
  ]);

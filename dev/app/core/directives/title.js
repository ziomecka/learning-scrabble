/* jshint esversion: 6 */
/** Custom directive, instead of ng-repeat to avoid unnecessary watch. */
const directive = appTitle => {
  "ngInject";
  return {
    replace: true,
    restrict: "E",
    scope: {},
    link: (scope, element) => {
      let txt = "<h1 class='title'>";
      appTitle.forEach(letter => { // eslint-disable-line no-undef
        txt += `<span class='title__tile'>
        <span class="title__tile--letter"> ${letter.letter} </span>
        <span class="title__tile--points"> ${letter.points} </span>
        </span>`;
      });
     txt += "</h1>";
     element.append(txt);
   }
  };
};

angular // eslint-disable-line no-undef
  .module("app")
  .directive("appTitle", directive);

/* jshint esversion: 6 */
angular
  .module("newuserModule")
  .directive("comparePasswords", () => {
    return {
      restrict: "A",
      require: "ngModel",
      link: ($scope, element, attr, ngModel) => {
        const validate = val => {
          let result = ((val === angular.element("#password").val()) &&
                        (val === angular.element("#repeatedPassword").val()));
          return result;
        };

        const validator = val => {
          $scope.createUserForm.$setValidity("passwordsNotMatch", validate(val));
          return val;
        };

        /** Attach validator to the element */
        ngModel.$parsers.unshift(validator);
        ngModel.$formatters.unshift(validator);
      }
    };
  });

/* jshint esversion: 6 */
angular
  .module("newuserModule")
  .directive("comparePasswords", () => {
    return {
      restrict: "A",
      require: "ngModel",
      link: ($scope, element, attr, ngModel) => {
        ngModel.$validators.invalidPasswords = () => {
          if (angular.element("#password").val() !== angular.element("#repeatedPassword").val()) {
            $scope.createUserForm.$setValidity("passwordsNotMatch", false);
          } else {
            $scope.createUserForm.$setValidity("passwordsNotMatch", true);
          }
        };
      }
    };
  });

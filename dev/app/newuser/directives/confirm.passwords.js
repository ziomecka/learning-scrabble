/* jshint esversion: 6 */
const directive = (
  $document
) => {
  "ngInject";
  return {
    restrict: "A",
    require: "ngModel",
    link: (scope, element, attr, ngModel) => {
      const form = "newuserForm";
      const validationErrorKey = "passwordNotConfirmed";
      const idPassword = "password";
      const idConfirmPassword = "confirmPassword";

      const validate = () => {
        return (
          $document[0].getElementById(idPassword).value ===
          $document[0].getElementById(idConfirmPassword).value
        );
      };

      const validator = val => {
        let result = validate();
        scope[form].$setValidity(validationErrorKey, result);
        return val;
      };

      // let onlyFalse = () => validator === false? false : undefined;
      /** Attach validator to the element */
      ngModel.$parsers.unshift(validator); // from view to model
      ngModel.$formatters.unshift(validator); // from model to view
    }
  };
};

angular // eslint-disable-line no-undef
  .module("newuserModule")
  .directive("confirmPassword", directive);

/* jshint esversion: 6 */
const func = function () {
  this.$get = () => {
    return {
      "getProvider": this.compileProvider
    };
  };
};

angular // eslint-disable-line no-undef
  .module("app")
  .provider("dynamicDirectiveService", func);

/* jshint esversion: 6 */
import app from "../../dev/app/app";
describe("AuthorizationController", () => {
  beforeEach(angular.mock.module("app"));
  let $controller;
  beforeEach(angular.mock.inject(_$controller_ => {
    $controller = _$controller_;
  }));

  describe("Authorization contorller", () => {
    it("logs", () => {
        // let controller = $controller("appCtrl");
        // let data = {};
        // controller.loginUser(data);
    });
  });
});

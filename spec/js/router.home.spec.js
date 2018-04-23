/* jshint esversion: 6 */
import app from "../../dev/app/app";

describe("home route" , () => {
  beforeEach(angular.mock.module("app"));

  describe("home route", () => {
    let $location;

    const socketFactoryMock = () => {
      jasmine.createSpyObj("socketFactory", [
        "logSocket"
      ]);
    };

    const mockServices = ($provide) => {
        $provide.factory("socketFactory", () => {
          return socketFactoryMock();
        });
    };

    const services = ($injector) => {
      $location = $injector.get("$location");
    };

    beforeEach(() => {
      angular.mock.module("my.templates", mockServices);
      angular.mock.inject(services);
    });

    describe("when navigating to `/`", () => {
      const goTo = url => {
        $location.url(url);
      };

      it("transitions to the login state", () => {
        goTo("/");

        expect(socketFactory.logSocket).toHaveBeenCalled();
      });
    });
  });
});

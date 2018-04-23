/* jshint esversion: 6 */

const protractorMatchers = require("jasmine-protractor-matchers");
const url = "http://localhost:5000";
const urlDidNotChanged = () => {
  return browser.getCurrentUrl().then(u => {
    return u === url;
  });
};
const login = "df";
const password = "df";
const standardTime = 2000;

describe("Scrabble app", () => {
  beforeEach(function() {
    jasmine.addMatchers(protractorMatchers);
  });

  it("should have a title", () => {
    browser.get(url);
    expect(browser.getTitle()).toEqual("Let's play scrabble");
  });

  it("should go to rooms after loggin in", () => {
    browser.get(url);
    element(by.model("login")).sendKeys(login);
    element(by.model("password")).sendKeys(password);
    let result;
    element(by.css(".button__main")).click().then(() => {
      const EC = protractor.ExpectedConditions;
      browser.wait(EC.urlContains("rooms"), standardTime);
      expect(browser.getCurrentUrl()).toEqual(url + "/rooms");
    });

  });

  it("should stay at authorization page when password incorrect", () => {
    browser.get(url);
    element(by.model("login")).sendKeys(login);
    element(by.model("password")).sendKeys(password + "fff");
    let result;
    element(by.css(".button__main")).click().then(() => {
      const EC = protractor.ExpectedConditions;
      browser.wait(EC.urlContains("authorization"), standardTime);
      expect(browser.getCurrentUrl()).toEqual(url + "/authorization");
    });

    // expect($(".form__message--error")).toAppear(10000);

  });

});

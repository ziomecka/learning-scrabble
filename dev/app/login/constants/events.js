/* jshint esversion: 6 */
import events from "../../../server/app/authorization/authorization.events";
angular // eslint-disable-line no-undef
  .module("loginModule")
  .constant("loginEvents", events);

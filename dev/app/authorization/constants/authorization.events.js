/* jshint esversion: 6 */
import events from "../../../server/app/authorization/authorization.events";
angular
  .module("authorizationModule")
  .constant("authorizationEvents", events);

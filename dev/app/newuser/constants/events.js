/* jshint esversion: 6 */
import events from "../../../server/app/newuser/newuser.events";
angular
  .module("newuserModule")
  .constant("newuserEvents", events);

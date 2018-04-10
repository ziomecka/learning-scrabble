/* jshint esversion: 6 */
import events from "../../../server/app/room/room.events";
angular
  .module("roomModule")
  .constant("roomEvents", events);

/* jshint esversion: 6 */
import events from "../../../server/app/room/room.events";
angular // eslint-disable-line no-undef
  .module("roomModule")
  .constant("roomEvents", events);

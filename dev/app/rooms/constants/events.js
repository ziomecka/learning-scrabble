/* jshint esversion: 6 */
import events from "../../../server/app/rooms/rooms.events";

 angular // eslint-disable-line no-undef
   .module("roomsModule")
   .constant("roomsEvents", events);

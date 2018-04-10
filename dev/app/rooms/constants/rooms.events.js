/* jshint esversion: 6 */
import events from "../../../server/app/rooms/rooms.events";

 angular
   .module("roomsModule")
   .constant("roomsEvents", events);

/* jshint esversion: 6 */
import serverEvents from "../../server/server.events";

 angular
   .module("app")
   .constant("clientEvents", serverEvents);

/* jshint esversion: 6 */
import events from "../../server/cookies/cookies.events";

 angular
   .module("cookiesModule")
   .constant("cookiesEvents", events);

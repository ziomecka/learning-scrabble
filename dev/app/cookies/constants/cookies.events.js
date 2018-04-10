/* jshint esversion: 6 */
import events from "../../../server/app/cookies/cookies.events";

 angular
   .module("cookiesModule")
   .constant("cookiesEvents", events);

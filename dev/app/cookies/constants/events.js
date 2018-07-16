/* jshint esversion: 6 */
import events from "../../../server/app/cookies/authorization.cookies.events";

angular // eslint-disable-line no-undef
 .module("cookiesModule")
 .constant("cookiesEvents", events);

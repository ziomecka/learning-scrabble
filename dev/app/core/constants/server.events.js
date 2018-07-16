/* jshint esversion: 6 */
import events from "../../../server/core/server.events";

angular // eslint-disable-line no-undef
  .module("app")
  .constant("serverEvents", events);

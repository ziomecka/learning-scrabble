/* jshint esversion: 6 */
const scrabblePlayerOptions = {
  name: undefined,
  id: undefined,
  time: undefined
};

angular // eslint-disable-line no-undef
  .module("scrabblePlayerModule")
  .constant("scrabblePlayerOptions", scrabblePlayerOptions);

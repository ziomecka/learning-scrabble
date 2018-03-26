/* jshint esversion: 6 */
import Bag from "../../app/bag.class";
import lettersNumber from "../../app/letters/letters.number.json";
import lettersPoints from "../../app/letters/letters.points.json";
import pointsTable from "../../app/letters/points.json";
import findkey from "lodash/findkey";

describe("Initialised bag ", () => {
  it("without language has correct number of tiles for each letter, " +
  "with correct number of points (as specified for the default language)", () => {
    let bag = new Bag();
    let lang = "Polish";
    let points = 0;
    Object.keys(lettersNumber[lang]).forEach((letter) => {
      expect(bag.filter((item) => item.letter === letter).length)
        .toBe(lettersNumber[lang][letter]);
      let level = findkey(lettersPoints[lang], (arr) => arr.includes(letter));
      points = pointsTable[lang][level];
      expect(bag.filter((item) => item.letter === letter).every((tile) => tile.points === points))
        .toBe(true);
    });
  });

  it("with English language has correct number of tiles for each letter, " +
  "with correct number of points", () => {
    let lang = "English";
    let bag = new Bag({lang: lang});
    let points = 0;
    Object.keys(lettersNumber[lang]).forEach((letter) => {
      expect(bag.filter((item) => item.letter === letter).length)
        .toBe(lettersNumber[lang][letter]);
      let level = findkey(lettersPoints[lang], (arr) => arr.includes(letter));
      points = pointsTable[lang][level];
      expect(bag.filter((item) => item.letter === letter).every((tile) => tile.points === points))
        .toBe(true);
    });
  });
});

/* jshint esversion: 6 */
import Game from "../../app/game.class";
import defaults from "../../app/defaults/defaults";

describe("Initialised game", () => {

  it("without arguments has default players", () => {
    let lang = "Polish";
    const game = new Game();
    expect(game.players.length).toBe(2);
    expect(game.players[0].name).toBe(defaults.players[lang][0]);
    expect(game.players[1].name).toBe(defaults.players[lang][1]);
  });

  it("with language argument has default players of this language", () => {
    let lang = "English";
    let options = {
      lang: lang
    };
    const game = new Game(options);
    expect(game.players.length).toBe(2);
    expect(game.players[0].name).toBe(defaults.players[lang][0]);
    expect(game.players[1].name).toBe(defaults.players[lang][1]);
  });

  it("with players argument has the received players", () => {
    let options = {
      players: ["Kate", "James"]
    };
    const game = new Game(options);
    expect(game.players.length).toBe(2);
    expect(game.players[0].name).toBe(options.players[0]);
    expect(game.players[1].name).toBe(options.players[1]);
  });
});

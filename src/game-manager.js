import { json } from "stream/consumers";
import { Game, Player } from "./game.js";
import { stringify } from "querystring";
// Singleton
export class GameManager {
  /**
   * @type {GameManager}
   */
  instance;

  /**
   * @type {Game[]}
   */
  games = [];

  /**
   * @returns {GameManager}
   * @static
   */
  static getInstance() {
    if (!this.instance) {
      this.instance = new GameManager();
    }

    return this.instance;
  }

  /**
   * @returns {Game | null}
   * @static
   */

  static findAvailableGame() {
    for (const game of this.getInstance().games) {
      if (game.players.length < 2) {
        return game;
      }
    }

    return null;
  }

  /**
   * @param {Player} player
   * @static
   */
  static joinGame(player) {
    // Find a empty game
    var game = this.findAvailableGame();
    if (!game) {
      game = new Game();
      this.getInstance().games.push(game);
    }
    game.join(player);
    // player.joinedGame(game);
    console.log(JSON.stringify(this.getInstance().games.map((g) => g.json())));
  }
  static leaveGame(player) {
    // if(player)
    const game = player.game;
    if (!game) {
      console.error("Player not assigned to a game.");
      return;
    }
    const games = this.getInstance().games;

    const players = game.players.filter((p) => p.socket.id != player.socket.id);
    // const p = game.players.indexOf(player);
    // game.players.splice(p, 1);
    game.players = players;
    if (game.players.length === 0) {
      const index = games.indexOf(game);
      console.log(index);
      games.splice(index, 1);

      console.log(`Game deleted All Player Disconnected!!`);
    }
  }
}

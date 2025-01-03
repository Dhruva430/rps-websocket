import { Game, Player } from "./game.js";
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
    player.joinedGame(game);
  }
}

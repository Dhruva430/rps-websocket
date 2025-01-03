import { v4 as uuid } from "uuid";
export class Game {
  /**
   * @type {Player[]}
   */
  players;

  constructor() {
    this.id = uuid();
    this.players = [];
  }

  /**
   * @param {Player} player
   */
  join(player) {
    if (this.players.length >= 2) {
      throw new Error("Game is full");
    }
    this.players.push(player);
    if (this.players.length >= 2) {
      this.ready();
    }
  }

  /**
   * @param {Player} player
   */
  leave(player) {
    const idx = this.players.findIndex((p) => p.socket.id == player.socket.id);
    if (idx == -1) {
      throw new Error("You are not in game");
    }

    this.players.splice(idx, 1);
  }

  json() {
    return {
      id: this.id,
      players: this.players.map((p) => p.json()),
    };
  }

  broadCast(ev, message) {
    for (const player of this.players) {
      player.socket.emit(ev, message);
    }
  }

  ready() {
    this.broadCast("game:ready", this.json());
  }

  /**
   * @param {Player} player
   */

  runMove(player) {
    // const p1 = this.players[0];
    // const p2 = this.players[1];

    var winner = null;
    const [p1, p2] = this.players;
    // if (p1.move == "paper") {
    //   if (p2.move == "rock") {
    //     winner = p1;
    //   }
    // }
    if (!p1 || !p2) {
      return;
    }

    if (!p1.move || !p2.move) {
      return;
    }
    if (p1.move == p2.move) {
      this.broadCast("game:draw");
      return;
    } else if (
      (p1.move == "rock" && p2.move == "scissors") ||
      (p1.move == "scissors" && p2.move == "paper") ||
      (p1.move == "paper" && p2.move == "rock")
    ) {
      winner = p1;
    } else {
      winner = p2;
    }
    p1.move = null;
    p2.move = null;

    if (winner) {
      this.broadCast("game:won", { winner: winner.json() });
    }
  }
}

export class Player {
  /**
   * @type {Socket}
   */
  socket;

  /**
   *  @type {Game}
   */
  game;

  /**
   * @type {"rock" | "paper" | "scissors"}
   */
  move;

  /**
   * @param {Socket} socket
   */
  constructor(socket) {
    this.socket = socket;
  }

  /**
   * @param {Game} game
   */
  joinedGame(game) {
    this.game = game;

    this.socket.on("move", (move) => {
      if (this.move) return;
      this.move = move;
      this.game.runMove(this);
    });
  }

  json() {
    return { id: this.socket.id, name: "Dhruva" };
  }
}

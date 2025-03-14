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
    player.joinedGame(this);
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
  getCurrentPlayer(id) {
    return this.players.find((p) => p.socket.id == id);
  }
  getOpponent(id) {
    return this.players.find((p) => p.socket.id != id);
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
  broadcastNameUpdate(player) {
    const opponent = this.getOpponent(player.socket.id);
    if (opponent) {
      opponent.socket.emit("updateName", {
        playerId: player.socket.id,
        name: player.name,
      });
    }
  }

  ready() {
    this.broadCast("game:ready", this.json());
    this.players.forEach((player) => {
      const opponent = this.getOpponent(player.socket.id);
      if (opponent) {
        opponent.socket.emit("updateName", {
          playerId: player.socket.id,
          name: player.name,
        });
      }
    });
  }

  /**
   * @param {Player} player
   */

  runMove(player) {
    const opponent = this.getOpponent(player.socket.id);

    var winner = null;
    const [p1, p2] = this.players;

    if (!p1 || !p2) {
      return;
    }

    if (!p1.move || !p2.move) {
      return;
    }
    if (opponent) {
      opponent.socket.emit("opponent:waiting", {
        opponentName: player.name,
      });
    }
    if (p1.move == p2.move) {
      this.players.forEach((p) => {
        p.socket.emit("game:draw", {
          player: p.json(),
          opponent: this.getOpponent(p.socket.id).json(),
        });
      });
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

    if (winner) {
      this.players.forEach((p) => {
        p.socket.emit("game:won", {
          winner: winner.json(),
          player: p.json(),
          opponent: this.getOpponent(p.socket.id).json(),
        });
      });
      // this.broadCast("game:won", { winner: winner.json() });
    }
    this.players.forEach((p) => {
      p.socket.emit(`opponent:moveComplete`);
    });
    p1.move = null;
    p2.move = null;
  }
}

export class Player {
  /**
   * @type {Socket}
   */
  socket;

  /**
   * @type {string}
   */
  name;

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
    this.name = "unknown";
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
    return { id: this.socket.id, name: this.name, move: this.move };
  }
}

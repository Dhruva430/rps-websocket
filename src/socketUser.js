import { Player } from "./game.js";
import { Socket } from "socket.io";
import { GameManager } from "./game-manager.js";
let users = [];
export class SocketUser {
  /**
   * @type {Socket}
   */
  socket;
  /**
   *
   * @param {Socket} socket
   */
  constructor(socket) {
    this.socket = socket;
    users.push(socket.id);
    console.log(users);
    this.listen();
    // this.join();
  }

  join(name) {
    console.log(`joining a game`);
    const player = new Player(this.socket);
    player.name = name;

    this.player = player;
    GameManager.joinGame(player);
  }
  listen() {
    this.socket;
    this.socket.on("move", (move) => console.log("Your move", move));
    this.socket.on("name", (name) => {
      this.join(name);
    });
  }
  disconnect() {
    if (this.player) GameManager.leaveGame(this.player);
    console.log(this.socket.id + " is disconnected");
    users = users.filter((id) => id != this.socket.id);
    console.log(users);
  }
}

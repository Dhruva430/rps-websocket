// @ts-check

import express from "express";
import { router as apiRouter } from "./api/index.js";
import { Server as SocketIOServer } from "socket.io";
import { createServer } from "http";
import { SocketUser } from "../socketUser.js";

const app = express();
const server = createServer(app);
const io = new SocketIOServer(server);

app.use(express.static("public"));
app.use("/api", apiRouter);

io.on("connection", (socket) => {
  console.log(socket.id + " is connected");
  // socket.on("move", (move) => console.log(move));
  const user = new SocketUser(socket);
  socket.on("disconnect", () => {
    user.disconnect();
    // console.log(socket.id + " is disconnected");
  });
});

server.listen(5000);
console.log("App is live at http://localhost:5000");

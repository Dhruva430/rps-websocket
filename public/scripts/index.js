console.log("Script works");
let clicked = false;
let ready = false;
let join = false;
const rps = document.getElementById("rps");
const nameInput = document.getElementById("nameInput");
const dashboard = document.getElementById("dashboard");
const model = document.getElementById("model");
const span = document.getElementById("you");
const opponentNameElement = document.getElementById("opponentName");
const gameStatus = document.getElementById(`game-status`);
const you = document.getElementById("yourMove");
const opponent = document.getElementById("opponentMove");
const images = {
  rock: "../img/icon-rock.svg",
  paper: "../img/icon-paper.svg",
  scissors: "../img/icon-scissors.svg",
};
const radial = ``;

/** @type {import("socket.io-client").Socket} */
const socket = io();
if (localStorage.getItem("name")) {
  socket.emit("name", localStorage.getItem("name"));
  model.classList.add("hidden");
  span.textContent = localStorage.getItem("name");
}

if (localStorage.getItem("opponentName")) {
  opponentNameElement.textContent = localStorage.getItem("opponentName");
}

document.querySelectorAll(".rps").forEach((e) => {
  e.addEventListener("click", handleClick(e));
});

function handleClick(element) {
  return async () => {
    if (clicked) {
      return;
    }

    console.log(element.dataset.value);
    console.log(element);
    // await getData();
    try {
      const move = element.dataset.value;
      socket.emit("move", move);

      clicked = true;
      gameStatus.textContent = "Waiting for opponent's move...";
      gameStatus.classList.remove("hidden");
      gameStatus.classList.add("visible");
    } catch (error) {
      console.error("Error emitting move:", error);
    }
    // const animation = new KeyframeEffect();
  };
}

socket.on("game:ready", (data) => {
  console.log(data);
  ready = true;
});

socket.on("game:won", (data) => {
  console.log(data);
  rps.classList.add("hidden");
  dashboard.classList.remove("hidden");
  console.log("Winner", data.winner);
  gameStatus.classList.remove("visible");
  gameStatus.classList.add("hidden");

  setupPlayer(
    dashboard.querySelector("#player"),
    data.player.move,
    data.player.id == data.winner.id
  );

  setupPlayer(
    dashboard.querySelector("#opponent"),
    data.opponent.move,
    data.opponent.id == data.winner.id
  );
});

socket.on("connect", (id) => {
  // document.getElementById("myid").textContent = socket.id;
});

socket.on("game:draw", (data) => {
  console.log("Game is Draw");
  rps.classList.add("hidden");
  dashboard.classList.remove("hidden");
  setupPlayer(dashboard.querySelector("#player"), data.player.move);
  setupPlayer(dashboard.querySelector("#opponent"), data.opponent.move);
  gameStatus.classList.remove("visible");
  gameStatus.classList.add("hidden");
});

nameInput.addEventListener("change", (e) => {
  const name = nameInput.value;
  console.log(name);
  socket.emit("setName", name);
  localStorage.setItem("name", name);
  span.textContent = name;
  model.classList.add("hidden");
});

socket.on("game:waiting", (data) => {
  console.log(`${data.opponentName} is waiting for you `);
});

socket.on("game:moveComplete", (data) => {
  gameStatus.classList.remove("visible");
  gameStatus.classList.add("hidden");
});
/**
 *
 * @param {HTMLElement} player
 * @param {string} move
 */
function setupPlayer(player, move, isWinner) {
  const moveElement = player.getElementsByClassName("move")[0];
  moveElement.innerHTML = `<img src= "${images[move]}">`;
  moveElement.style.setProperty("--color", `var(--color-${move})`);
  if (isWinner) {
    console.log(`hello`);
    moveElement.classList.add(`radial`);
  }
}
socket.on("updateName", ({ playerId, name }) => {
  if (playerId !== socket.id) {
    opponentNameElement.textContent = name;
    localStorage.setItem("opponentName", name);
  }
});

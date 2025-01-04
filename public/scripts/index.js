console.log("Script works");
let clicked = false;
let ready = false;
let join = false;
const rps = document.getElementById("rps");
const nameInput = document.getElementById("nameInput");
const dashboard = document.getElementById("dashboard");
const model = document.getElementById("model");
// const you = document.getElementById("yourMove");
// const opponent = document.getElementById("opponentMove");
const images = {
  rock: "../img/icon-rock.svg",
  paper: "../img/icon-paper.svg",
  scissors: "../img/icon-scissors.svg",
};

/** @type {import("socket.io-client").Socket} */
const socket = io();
if (localStorage.getItem("name")) {
  socket.emit("name", localStorage.getItem("name"));
  model.classList.add("hidden");
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
  setupPlayer(dashboard.querySelector("#player"), data.player.move);

  setupPlayer(dashboard.querySelector("#opponent"), data.opponent.move);
});

socket.on("connect", (id) => {
  document.getElementById("myid").textContent = socket.id;
});
socket.on("game:draw", (data) => {
  console.log("Game is Draw");
});

nameInput.addEventListener("change", (e) => {
  console.log(nameInput.value);
  socket.emit("name", nameInput.value);
  localStorage.setItem("name", nameInput.value);
  model.classList.add("hidden");
});

/**
 *
 * @param {HTMLElement} player
 * @param {string} move
 */
function setupPlayer(player, move) {
  const moveElement = player.getElementsByClassName("move")[0];
  moveElement.innerHTML = `<img src= "${images[move]}">`;
  moveElement.style.setProperty("--color", `var(--color-${move})`);
}
// socket.on("game:join", (data) => {
//   console.log("player Joined the game");
//   join = true;
// });

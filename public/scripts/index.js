console.log("Script works");
let clicked = false;
let ready = false;

/** @type {import("socket.io-client").Socket} */
const socket = io();

document.querySelectorAll(".rps").forEach((e) => {
  e.addEventListener("click", handleClick(e));
});

function handleClick(element) {
  return async () => {
    if (clicked || !ready) {
      return;
    }

    console.log(element.dataset.value);
    console.log(element);
    // await getData();

    try {
      socket.emit("move", element.dataset.value);

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
});
socket.on("connect", (id) => {
  document.getElementById("myid").textContent = socket.id;
});
socket.on("game:draw", (data) => {
  console.log("Game is Draw");
});

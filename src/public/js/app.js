import { append } from "express/lib/response";

const socket = io();

const lobby = document.getElementById("lobby");
const form = lobby.querySelector("form");
const room = document.getElementById("room");

room.hidden = true;

let roomName, nickname;

function addMessage(message) {
  const ul = room.querySelector("ul");
  const li = document.createElement("li");
  li.innerText = message;
  ul.appendChild(li);
}

function handleMessageSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#msg input");
  const value = input.value;
  socket.emit("new_message", input.value, roomName, () => {
    addMessage(`You: ${value}`);
    input.value = "";
  });
}
function handleNicknameSubmit(event) {
  event.preventDefault();
  const input = room.querySelector("#changename input");
  const value = input.value;
  socket.emit("nickname", input.value);
}

function showRoom() {
  lobby.hidden = true;
  room.hidden = false;

  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName}`;
  const msgForm = room.querySelector("#msg");
  const nameForm = room.querySelector("#changename");
  msgForm.addEventListener("submit", handleMessageSubmit);
  nameForm.addEventListener("submit", handleNicknameSubmit);
}

function handleRoomSubmit(event) {
  event.preventDefault();
  const roomInput = form.querySelector("#roomname");
  const nickInput = form.querySelector("#nickname");
  socket.emit("enter_room", roomInput.value, nickInput.value, showRoom);
  roomName = roomInput.value;
  roomInput.value = "";
}

form.addEventListener("submit", handleRoomSubmit);

socket.on("welcome", (user, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${user} joined!`);
});

socket.on("bye", (left, newCount) => {
  const h3 = room.querySelector("h3");
  h3.innerText = `Room ${roomName} (${newCount})`;
  addMessage(`${left} left.`);
});

socket.on("new_message", addMessage);

socket.on("room_change", (rooms) => {
  const roomList = lobby.querySelector("ul");
  roomList.innerHTML = "";
  if (rooms.length === 0) {
    return;
  }
  rooms.forEach((room) => {
    const li = document.createElement("li");
    li.innerText = room;
    roomList.append(li);
  });
});

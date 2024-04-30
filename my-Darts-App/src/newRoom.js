"use strict";

const apiUrl = 'http://localhost:3000/graphql';

const socket = io.connect('http://localhost:3003');

// Call the function to generate the room name when the window loads
window.addEventListener("load", () => {
    generateRoomName();
});

function generateRoomName() {
    // Generate a random room name
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let roomName = '';
    for (let i = 0; i < 1; i++) {
        roomName += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    displayRoomName(roomName);
    // Call the function to connect to the room
    connectToRoom(roomName);
}

function displayRoomName(roomName) {
    // Display the room name on the site
    const roomNameElement = document.getElementById("roomName");
    if (roomNameElement) {
        roomNameElement.textContent = roomName;
    }
}

function connectToRoom(roomName) {
    // Connect to the room
    socket.emit("create", roomName);
}



// Listen for form submission event
document.querySelector("form").addEventListener("submit", (event) => {
    event.preventDefault();
    const inp = document.getElementById("m");
    // Emit an "update" event with the input value
    socket.emit("update", inp.value);
    inp.value = "";
});

document.querySelector("input[id=valueSender]").addEventListener("click", (event) => {
    event.preventDefault();
    const inp = document.getElementById("ok");
    const value = parseInt(inp.value);
    if (isNaN(value)) {
        alert("Please enter a valid integer value.");
        return;
    }
    socket.emit("decreaseScore", value);
    inp.value = "";
});

// Listen for "test" event from the server
socket.on("test", (msg) => {
    // Create a new list item element
    const item = document.createElement("li");
    item.innerHTML = msg;
    // Append the new item to the messages list
    const list = document.getElementById("messages");
    list.appendChild(item);
});


socket.on("updateScore", (msg) => {
    // Create a new list item element
    const item = document.createElement("li");
    item.innerHTML = msg;
    // Append the new item to the messages list
    const list = document.getElementById("messages");
    list.appendChild(item);
});


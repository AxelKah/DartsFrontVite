"use strict";

const apiUrl = 'http://localhost:3000/graphql';

const socket = io('http://localhost:3003');

function onPageLoad() {
    var pageId = document.body.id;

    switch (pageId) {
        case "newRoom":
            generateRoomName();
            break;
        case "joinRoom":
            askRoomName();
            break;
        default:
            break;
    }
}



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
    socket.on('connect', () => {
      // Connection established, now you can access socket.id safely
      console.log("current client's name is: " + socket.id);
      socket.emit("create", roomName);
      socket.emit("setCurrentTurn", socket.id);
    });
  }


function askRoomName(){
    const roomName = prompt("Enter room name:");
    socket.emit("create", roomName);
    console.log("current client's name is: " + socket.id);

}

document.querySelector("form").addEventListener("submit", (event) => {
  event.preventDefault();
  const inp = document.getElementById("m");
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

socket.on("test", (msg) => {
  const item = document.createElement("li");
  item.innerHTML = msg;
  const list = document.getElementById("messages");
  list.appendChild(item);
});





socket.on("updateScore", (msg) => {
    // Parse the received message as an object
    const { name, score, turn } = JSON.parse(msg);

    // Create a new list item element
    const item = document.createElement("li");
    item.innerHTML = `${name}: ${score}`;

    // Append the new item to the messages list
    const list = document.getElementById("messages");
    list.appendChild(item);

    // Update the client score div
    const clientScoreDiv = document.getElementById("clientScores");
    clientScoreDiv.innerHTML = `${name}: ${score}<br> Current turn: ${turn}`;

});

socket.on("gameOver", (msg) => {
    alert(msg);
   // location.reload();

   //////////////////////////////////////////////////////
   //const gameResult = await doGraphQLFetch(apiUrl, getGameResult, {});
});

socket.on("bust", (msg) => {
    alert(msg);
   // location.reload();
});

socket.on("currentTurn", (msg) => {
    currentTurn = msg;
});

socket.on("scoreUpdateInProgress", (msg) => {
    alert("test" + msg);
});


let currentTurn = null;

/*
socket.on("addAnimal", async(msg) => {
    const animalResult = await doGraphQLFetch(apiUrl, getAllAnimals, {});

    animalResult.animals.array.forEach((animal) => {
        const item = document.createElement("li");
        item.innerHTML = animal.animal_name;
        const list = document.getElementById("messages");
        list.appendChild(item);
    });
});

socket.on("addSpecies", async(msg) => {
    const speciesResult = await doGraphQLFetch(apiUrl, getAllSpecies, {});

    speciesResult.species.array.forEach((species) => {
        const item = document.createElement("li");
        item.innerHTML = species.species_name;
        const list = document.getElementById("messages");
        list.appendChild(item);
    });
  });

*/

window.onload = onPageLoad;
import { io } from 'socket.io-client';

const apiUrl = 'http://localhost:3000/graphql';

const socket = io('http://localhost:3003');

let connectedToRoom = false;



const newRoomButton = document.querySelector(
    '#login-button',
  ) as HTMLButtonElement;



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
/*
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
}*/


///TOIMIIIII
const generateRoomName = () => {
    // Generate a random room name
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let roomName = '';
    for (let i = 0; i < 1; i++) {
        roomName += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    console.log("roomName: " + roomName)
    displayRoomName(roomName);
    // Call the function to connect to the room
    connectToRoom(roomName);
};


//TOIMIII
const displayRoomName = (roomName: string) => {
    const roomNameElement = document.getElementById('roomName');
    console.log("koittaa näyttää")
    if (roomNameElement) {
        roomNameElement.textContent = `your room code is: ${roomName}`;
    }
};



const connectToRoom = (roomName: string) => {
    console.log("koittaa connectaa")
    socket.on('connect', () => {
        // Connection established, now you can access socket.id safely
        console.log("current client's name is: " + socket.id);
        socket.emit("create", 'B');
        socket.emit("setCurrentTurn", socket.id);
    });
}
/*
function connectToRoom(roomName: string) {
    socket.on('connect', () => {
        // Connection established, now you can access socket.id safely
        console.log("current client's name is: " + socket.id);
        socket.emit("create", roomName);
        socket.emit("setCurrentTurn", socket.id);
    });
}
*//*
function askRoomName() {
    const roomName = prompt("Enter room name:");
    socket.emit("create", roomName);
    console.log("current client's name is: " + socket.id);
}
*/

//// KYSy huoneen ninme
const askRoomName = () => {
    const roomName = prompt("Enter room name:");
    socket.emit("create", roomName);
    console.log("current client's name is: " + socket.id);
    connectedToRoom = true;
    console.log("connectedToRoom: " + connectedToRoom);
}

//Submit nappi
document.querySelector("form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const inp = document.getElementById("m") as HTMLInputElement;
    socket.emit("update", inp.value);
    console.log("score sent: " + inp.value);
    inp.value = "";
generateRoomName();
});

///SendValue nappi
document.querySelector("input[id=valueSender]")?.addEventListener("click", (event) => {
    event.preventDefault();
    const inp = document.getElementById("ok") as HTMLInputElement;
    const value = parseInt(inp.value);
    console.log("scorevaleu fiels: " + value);
    if (isNaN(value)) { 
        alert("Please enter a valid integer value.");
        return;
    }
    socket.emit("decreaseScore", value);
    inp.value = "";
});

///JoinGame nappi
document.querySelector("input[id=joinGame]")?.addEventListener("click", (event) => {
    event.preventDefault();
    if(connectedToRoom == false) {
    askRoomName();
    }
    else {
        alert("You are already connected to a room.");
    }
  
});


///EndGame nappi
document.querySelector("input[id=endGame]")?.addEventListener("click", (event) => {
    event.preventDefault();
    connectedToRoom = false;
  //  socket.emit("endGame");
});

document.querySelector("input[id=valueSender]")?.addEventListener("click", () => {
    console.log("test");
});







socket.on("test", (msg: string) => {
    const item = document.createElement("li");
    item.innerHTML = msg;
    const list = document.getElementById("messages");
    list?.appendChild(item);
});

socket.on("updateScore", (msg: string) => {
    // Parse the received message as an object
    const { name, score, turn } = JSON.parse(msg);

    // Create a new list item element
    const item = document.createElement("li");
    item.innerHTML = `${name}: ${score}`;

    // Append the new item to the messages list
    const list = document.getElementById("messages");
    list?.appendChild(item);

    // Update the client score div
    const clientScoreDiv = document.getElementById("clientScores");
    if (clientScoreDiv) {
        clientScoreDiv.innerHTML = `${name}: ${score}<br> Current turn: ${turn}`;
    }
});

socket.on("gameOver", (msg: string) => {
    alert(msg);
    // location.reload();

    ///////////////////////////////////////////////////////
    //const gameResult = await doGraphQLFetch(apiUrl, getGameResult, {});
});

socket.on("bust", (msg: string) => {
    alert(msg);
    // location.reload();
});

socket.on("currentTurn", (msg: string) => {
    currentTurn = msg;
});

socket.on("scoreUpdateInProgress", (msg: string) => {
    alert("test" + msg);
});

let currentTurn: string | null = null;

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

import 'bootstrap/dist/css/bootstrap.min.css';
import { io } from 'socket.io-client';
import { addGame } from './queries';
import { doGraphQLFetch } from './fetch';
import updateUserPanel from './interface/updateUserPanel';


const apiUrl = 'http://localhost:3000/graphql';

const socket = io('http://localhost:3003');

let connectedToRoom = false;


const newRoomButton = document.querySelector(
    '#login-button',
  ) as HTMLButtonElement;


function onPageLoad() {
    const user_name = localStorage.getItem('user_name');
    console.log("user: " + user_name)
    if (user_name) {
        updateUserPanel(user_name);

    }
}



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
    console.log("UUUSI HUONE")
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
    console.log("current client's name is: " + socket.id);
        socket.emit("create", roomName);
     //   socket.emit("setUserName", user_name);
        socket.emit("setCurrentTurn", socket.id);
        connectedToRoom = true;
    socket.on('connect', () => {
        // Connection established, now you can access socket.id safely
        
    });
};


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
    const user_name = localStorage.getItem('user_name');
    socket.emit("update", `${user_name} send ${inp.value}`);
    console.log("score sent: " + inp.value);
    inp.value = "";
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
document.querySelector("a[id=joinGame]")?.addEventListener("click", (event) => {
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
    if(connectedToRoom == true) {
    connectedToRoom = false;
    alert("Disconnected from a room.");
    }
    else {
        alert("You are not connected to a room.");
    }
  //  socket.emit("endGame");
});

///CreateGame nappi

document.querySelector("a[id=createGame]")?.addEventListener("click", (event) => {
    event.preventDefault();
    generateRoomName();
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
    socket.on("clientMessage", (msg: string) => {
        alert(msg);
        connectedToRoom = false;
    });


socket.on("gameOver", (msg: string) => {
    //const roomClients = io.sockets.adapter.rooms.get(room.toString()) ?? new Set<string>(); // Cast 'room' to 'string' and provide a default value of an empty set
    alert(msg);
    console.log(msg);
    connectedToRoom = false;
    const sendMessageBtn = document.querySelector("input[id=valueSender]") as HTMLButtonElement;
    sendMessageBtn.disabled = true;

    });

    

    // location.reload();

    ///////////////////////////////////////////////////////
    //const gameResult = await doGraphQLFetch(apiUrl, getGameResult, {});


/*
/// Add winner
socket.on("sendArray", async (players: string[]) => {
    console.log("clients: " + players);
    players.fo<rEach((player) => {
        console.log("room clients: " + player);
    });
    try {
        const winnerData = await doGraphQLFetch(apiUrl, addGame, {
            game: {
                user1: players[0],
                user2: players[1],
                winner: "test",
            },
        });
        console.log("winnerData: ", winnerData);
    } catch (error) {
        console.error("Error:", error);
    }
});

*/


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

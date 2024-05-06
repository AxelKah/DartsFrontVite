import 'bootstrap/dist/css/bootstrap.min.css';
import { io } from 'socket.io-client';
import { addGame } from './graphql/queries';
import { doGraphQLFetch } from './graphql/fetch';
import updateUserPanel from './interface/updateUserPanel';

const apiUrl = import.meta.env.VITE_API_URL;
const socket = io(import.meta.env.VITE_SOCKET_URL);


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


///Generates new room name
const generateRoomName = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let roomName = '';
    for (let i = 0; i < 1; i++) {
        roomName += characters.charAt(Math.floor(Math.random() * characters.length));
    }
 //   console.log("roomName: " + roomName)
    displayRoomName(roomName);
   // console.log("UUUSI HUONE")
    connectToRoom(roomName);
};


//Shows room name on the page
const displayRoomName = (roomName: string) => {
    const roomNameElement = document.getElementById('roomName');
  //  console.log("koittaa näyttää")
    if (roomNameElement) {
        roomNameElement.textContent = `Your room code is: ${roomName}, share it with your friend!`;
    }
};

//Connects user to room
const connectToRoom = (roomName: string) => {
  //  console.log("current client's name is: " + socket.id);
        socket.emit("create", roomName);
     //   socket.emit("setUserName", user_name);
        socket.emit("setCurrentTurn", socket.id);
        connectedToRoom = true;
    socket.on('connect', () => {        
    });
};


//// Promts user to enter room name
const askRoomName = () => {
    const roomName = prompt("Enter room name:");
    socket.emit("create", roomName);
    console.log("current client's name is: " + socket.id);
    connectedToRoom = true;
    console.log("connectedToRoom: " + connectedToRoom);
}

//Submit button for sending messages
document.querySelector("form")?.addEventListener("submit", (event) => {
    event.preventDefault();
    const inp = document.getElementById("messageText") as HTMLInputElement;
    const user_name = localStorage.getItem('user_name');
    socket.emit("update", `${user_name} send: ${inp.value}`);
  //  console.log("score sent: " + inp.value);
    inp.value = "";
});

///Send darts values
document.querySelector("input[id=valueSender]")?.addEventListener("click", (event) => {
    event.preventDefault();
    const inp = document.getElementById("turnScore") as HTMLInputElement;
    const value = parseInt(inp.value);
    console.log("Turn score:  " + value);
    if (isNaN(value)) { 
        alert("Please enter a valid integer value.");
        return;
    }
    socket.emit("decreaseScore", value);
    inp.value = "";
});

//JoinGame button function
document.querySelector("a[id=joinGame]")?.addEventListener("click", (event) => {
    event.preventDefault();
    if (!localStorage.getItem('user_name')) {
        alert("Please log in before joining a game.");
        return;
    }
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
    if (!localStorage.getItem('user_name')) {
        alert("Please log in before creating a game.");
        return;
    }
    generateRoomName();
});

socket.on("test", (msg: string) => {
    const item = document.createElement("li");
    item.innerHTML = msg;
    const list = document.getElementById("messages");
    list?.appendChild(item);
});
//////////////////// vaihda id socketidksi joka tulee serveriltä
socket.on("updateScore", (msg: string) => {
    // Parse the received message as an object
    const { name, score, turn } = JSON.parse(msg);
    console.log("name: " + name + " score: " + score + " turn: " + turn);
    // Create a new list item element
    let p1Score = document.getElementById("player1Score");
    let p2Score = document.getElementById("player2Score");
    const item = document.createElement("li");
    item.innerHTML = `${name}: ${score}`;
    if (p1Score) {
        p1Score.innerHTML = `${score}`;
    }

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

    socket.on("sendArray", (players: Array<string>) => {
        const p1Name = document.getElementById("p1Name");
        const p2Name = document.getElementById("p2Name");
        console.log("clients: " + players);
        players.forEach((player) => {
            console.log("room clients: " + player);
            if (p1Name) {
                p1Name.innerHTML = players[0];
            }
            if (p2Name) {
                p2Name.innerHTML = players[1];
            }
        });
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
    alert(msg);
});

let currentTurn: string | null = null;


window.onload = onPageLoad;

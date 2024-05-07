import 'bootstrap/dist/css/bootstrap.min.css';
import { io } from 'socket.io-client';
import updateUserPanel from './interface/updateUserPanel';

const apiUrl = import.meta.env.VITE_API_URL;
const socket = io(import.meta.env.VITE_SOCKET_URL);

const p1Name = document.getElementById("p1Name") as HTMLDivElement;
const p2Name = document.getElementById("p2Name") as HTMLDivElement;
const p1Score = document.getElementById("player1Score") as HTMLDivElement;
const p2Score = document.getElementById("player2Score") as HTMLDivElement;
const sendMessageBtn = document.querySelector("input[id=valueSender]") as HTMLButtonElement;
const roomNameElement = document.getElementById('roomName') as HTMLDivElement;
const newRoomButton = document.querySelector('#login-button') as HTMLButtonElement;
const createGameButton = document.querySelector("a[id=createGame]") as HTMLButtonElement;
const joinGameButton = document.querySelector("a[id=joinGame]") as HTMLButtonElement;
const endGameButton = document.querySelector("input[id=endGame]") as HTMLButtonElement;



const item = document.createElement("li");

let connectedToRoom = false;




function onPageLoad() {
    const user_name = localStorage.getItem('user_name');
  //  console.log("user: " + user_name)
    if (user_name) {
        updateUserPanel(user_name);

    }
}


///Generates new room name
const generateRoomName = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let roomName = '';
    // Change the number in the loop to change the length of the room name
    for (let i = 0; i < 1; i++) {
        roomName += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    displayRoomName(roomName);
    connectToRoom(roomName);
};


//Shows room name on the page
const displayRoomName = (roomName: string) => {
    if (roomNameElement) {
        roomNameElement.textContent = `Your room code is: ${roomName}, share it with your friend!`;
    }
};

//Connects user to room
const connectToRoom = (roomName: string) => {
        socket.emit("create", roomName);
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
    inp.value = "";
});

///Send darts values
document.querySelector("input[id=valueSender]")?.addEventListener("click", (event) => {
    event.preventDefault();
    const inp = document.getElementById("turnScore") as HTMLInputElement;
    const value = parseInt(inp.value);
    if (isNaN(value)) { 
        alert("Please enter a valid integer value.");
        return;
    }
    socket.emit("decreaseScore", value);
    inp.value = "";
});

//JoinGame button function
joinGameButton.addEventListener("click", (event) => {
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
endGameButton.addEventListener("click", (event) => {
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

///CreateGame btn function
createGameButton.addEventListener("click", (event) => {
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
socket.on("updateScore", (msg: string) => {
    const { name, score, turn } = JSON.parse(msg);
    item.innerHTML = `${name}: ${score}`;
    if (name === p1Name?.innerHTML) {
        if (p1Score) {
            p1Score.innerHTML = `${score}`;
        }
    } else if (name === p2Name?.innerHTML) {
        if (p2Score) {
            p2Score.innerHTML = `${score}`;
        }
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
    alert(msg);
    connectedToRoom = false;
    sendMessageBtn.disabled = true;

    });

    socket.on("sendArray", (players: Array<string>) => {
  // console.log("clients: " + players);
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
socket.on("sendWinner", async (gameInfo: string) => {

    const {user1, user2, winner} = JSON.parse(gameInfo);
    console.log("user1: " + user1 + " user2: " + user2 + " winner: " + winner);

    //console.log("pelin tiedot: " + gameInfo);
   // console.log("pelaajat: " + gameInfo[0] + " ja " + gameInfo[1]);
   // const {user1, user2, winner} = JSON.parse(gameInfo[0]);
 //   console.log("user1: " + user1 + " user2: " + user2 + " winner: " + winner);
    try {
        console.log("user1: " + user1 + " user2: " + user2 + " winner: " + winner);

        const winnerData = await doGraphQLFetch(apiUrl, addGame, 
            {
            game: {
                user1: user1,
                user2: user2,
                winner: winner,
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
    console.log("current turn update: " + msg);
    currentTurn = msg;
});

socket.on("scoreUpdateInProgress", (msg: string) => {
    alert(msg);
});

let currentTurn: string | null = null;


window.onload = onPageLoad;

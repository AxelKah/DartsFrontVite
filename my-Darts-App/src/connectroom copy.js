"use strict";

const apiUrl = 'http://localhost:3000/graphql';

const socket = io.connect('http://localhost:3003');
window.addEventListener("load", () => {
  const roomName = prompt("Enter room name:");
  socket.emit("create", roomName);
});


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

  socket.on("updateScore", (msg) => {
    // Create a new list item element
    const item = document.createElement("li");
    item.innerHTML = msg;
    // Append the new item to the messages list
    const list = document.getElementById("messages");
    list.appendChild(item);
});
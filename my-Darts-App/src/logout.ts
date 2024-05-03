import { Modal } from "bootstrap";
import createLogoutModal from "./interface/createLogoutModal";

const myModal = new Modal('#darts-modal');
const targetModal = document.querySelector('.modal-content')!;


function logout() {
  // Get all the keys from the local storage
  const keys = Object.keys(localStorage);
  console.log(keys.length);
  if (keys.length === 0) {
    return;
  } else {
    targetModal.innerHTML = createLogoutModal();
    myModal.show();
    // Iterate over the keys and remove each item from the local storage
    keys.forEach((key) => {
      localStorage.removeItem(key);
    });

    // Optionally, you can also clear the session storage if needed
    sessionStorage.clear();
    setTimeout(() => {
        myModal.hide();
      }, 2000);
    location.reload();
  }
}

// Attach the logout function to the logout button's click event
const logoutButton = document.getElementById("logout-button") as HTMLElement;
logoutButton.addEventListener("click", logout);

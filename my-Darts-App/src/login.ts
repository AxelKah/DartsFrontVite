import { Modal } from 'bootstrap';
import { Credentials } from "./interface/Credentials";
import LoginMessageResponse from "./interface/LoginMessageResponse";
import createLoginModal from "./interface/createLoginModal";
import createMessageModal from "./interface/createMessageModal";
import { User } from "./interface/User";

import { doGraphQLFetch } from './fetch';
import { login } from './queries';


//////////////// tää johki muualle?=////////////////////////



const loginButton = document.querySelector(
    '#login-button',
  ) as HTMLButtonElement;
  const targetModal = document.querySelector('.modal-content')!;

  const myModal = new Modal('#darts-modal');
  const user: User = {};


  ///////////////////////////// muuta tää .env:ksi////////////////////////
  const apiURL = 'http://localhost:3000/graphql';
  
  const forms = document.querySelector('#forms') as HTMLDivElement;




  loginButton.addEventListener('click', async () => {
    targetModal.innerHTML = createLoginModal();
    myModal.show();
    const loginForm = document.querySelector('#login-form') as HTMLFormElement;
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.querySelector('#username') as HTMLInputElement;
      const password = document.querySelector('#password') as HTMLInputElement;

      
      const credentials: Credentials = {
        username: username.value,
        password: password.value,
      };

      try {
        const loginData = (await doGraphQLFetch(apiURL, login, { credentials,
         })) as LoginMessageResponse;
         console.log(loginData);
         targetModal.innerHTML = createMessageModal(loginData.login.message);
         localStorage.setItem('token', loginData.login.token!);

         setTimeout(() => {
            myModal.hide();
          }, 2000);
          loginButton.parentElement!.classList.add('d-none');
          loginButton.parentElement!.classList.remove('d-none');
        //  forms.classList.remove('d-none');
          localStorage.setItem('token', loginData.login.token!);
// jos ei muuta keksitä          localStorage.setItem('user', JSON.stringify(loginData.login.user));
          user.user_name = loginData.login.user.user_name!;

} catch (error) {
        console.log(error);
      }
      
    });
  });

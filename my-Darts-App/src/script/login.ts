import { Modal } from 'bootstrap';
import { Credentials } from "../interface/Credentials";
import LoginMessageResponse from "../interface/LoginMessageResponse";
import createLoginModal from "../interface/createLoginModal";
import createMessageModal from "../interface/createMessageModal";
import { User } from "../interface/User";

import { doGraphQLFetch } from '../graphql/fetch';
import { login } from '../graphql/queries';
import updateUserPanel from '../interface/updateUserPanel';

const loginButton = document.querySelector(
    '#login-button',
  ) as HTMLButtonElement;
  const targetModal = document.querySelector('.modal-content')!;
  const myModal = new Modal('#darts-modal');
  const user: User = {};
  const apiUrl = import.meta.env.VITE_API_URL;
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
        const loginData = (await doGraphQLFetch(apiUrl, login, { credentials,
         })) as LoginMessageResponse;
         console.log(loginData);
         targetModal.innerHTML = createMessageModal(loginData.login.message);
         localStorage.setItem('token', loginData.login.token!);
         localStorage.setItem('user_name', loginData.login.user.user_name!);
         user.user_name = loginData.login.user.user_name!;
        updateUserPanel(user.user_name);

         setTimeout(() => {
            myModal.hide();
          }, 2000);
          loginButton.parentElement!.classList.add('d-none');
          loginButton.parentElement!.classList.remove('d-none');
          user.user_name = loginData.login.user.user_name!;

} catch (error) {
        console.log(error);
      }
      
    });
  });

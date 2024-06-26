import { Modal } from "bootstrap";
import { doGraphQLFetch } from '../graphql/fetch';
import createRegisterModal from "../interface/createRegisterModal";
import createMessageModal from "../interface/createMessageModal";
import { register } from "../graphql/queries";
import RegisterMessageResponse from "../interface/RegisterMessageResponse";


const registerButton = document.querySelector(
    '#register-button',
    ) as HTMLButtonElement;
    const targetModal = document.querySelector('.modal-content')!;

    const myModal = new Modal('#darts-modal');

    const apiURL = import.meta.env.VITE_API_URL;
  //  const apiURL = "https://axelkah-darts.azurewebsites.net/graphql";


    const forms = document.querySelector('#forms') as HTMLDivElement;

    registerButton.addEventListener('click', async () => {
        targetModal.innerHTML = createRegisterModal();
        myModal.show();
        const registerForm = document.querySelector('#register-form') as HTMLFormElement;
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.querySelector('#email') as HTMLInputElement;
            const username = document.querySelector('#username') as HTMLInputElement;
            const password = document.querySelector('#password') as HTMLInputElement;

            try {
            const registerData = await doGraphQLFetch(apiURL, register, { user: {
                email: email.value,
                user_name: username.value,
                password: password.value,
            }
            }) as RegisterMessageResponse;
            console.log(registerData);
            targetModal.innerHTML = createMessageModal(registerData.register.message);
            setTimeout(() => {
                myModal.hide();
                window.location.href = 'index.html';
              }, 2000);
        } catch (error) {
            console.log(error);
        }
 //           console.log(registerData);
   //         targetModal.innerHTML = createMessageModal(registerData.register.message);

            setTimeout(() => {
                myModal.hide();
            }, 2000);
            registerButton.parentElement!.classList.add('d-none');
            forms.classList.remove('d-none');
        });
    }
    );
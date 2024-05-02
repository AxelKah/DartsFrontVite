import { User } from "./User";

export default function updateUserPanel(user: User): void {
  const userPanel = document.querySelector('#navbar-text');

  if (userPanel) {
    userPanel.innerHTML = `Darts app,  ${user.user_name} `;
  }

}

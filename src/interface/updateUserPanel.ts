
export default function updateUserPanel(user: String): void {
  const userPanel = document.querySelector('#navbar-text');
  const topBarLoginRegister = document.querySelector('#logRegBtn') as HTMLElement; // Typecast topBarBtn to HTMLElement
  const topBarLogout = document.querySelector('#logout-button') as HTMLElement; // Typecast topBarBtn to HTMLElement
  const gamesBtn = document.querySelector('#game-button') as HTMLElement; // Typecast topBarBtn to HTMLElement
  if (userPanel) {
    userPanel.innerHTML = `Darts app,  Welcome ${user} `;
    topBarLoginRegister.style.display = 'none';
    topBarLogout.style.display = 'block';
    gamesBtn.style.display = 'block';
  }


}

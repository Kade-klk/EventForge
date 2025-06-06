window.addEventListener("DOMContentLoaded", () => {
  // Mostrar username si está logueado
  const username = sessionStorage.getItem("usernameLoged");
  const usernameSpan = document.getElementById("username-loged");
  if (username && usernameSpan) {
    usernameSpan.textContent = username;
  }
});
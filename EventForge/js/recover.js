document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("recover-form");
  const message = document.getElementById("message");

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();

    if (!email) {
      showMessage("Por favor, ingresa tu correo electrónico.", false);
      return;
    }

    // Simulación de recuperación (reemplaza con Firebase u otro backend real)
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    const usuarioEncontrado = usuarios.find(user => user.email === email);

    if (usuarioEncontrado) {
      // Simular envío de correo
      showMessage("¡Correo de recuperación enviado! Revisa tu bandeja de entrada.", true);
    } else {
      showMessage("Este correo no está registrado.", false);
    }
  });

  function showMessage(text, success = true) {
    message.textContent = text;
    message.className = success ? "success-message" : "error-message";
  }
});

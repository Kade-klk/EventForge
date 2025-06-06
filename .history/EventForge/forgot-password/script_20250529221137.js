document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.href = '../registration/login.html';
  });
});

document.getElementById("button-sendEmail").addEventListener('click', enviarEmail);

function enviarEmail() {
  const code = generarCodigo();
  const email = document.getElementById("email").value.trim();
  const serviceID = 'default_service';
  const templateID = 'template_g4gmc6z';

  emailjs.send(serviceID, templateID, {
    codigo: code,
    email: email,
  })
  .then(() => {
    sessionStorage.setItem("Codigo", code);
    sessionStorage.setItem("Email", email);
    window.location.href = '/get-code/get-code.html';
  })
  .catch((error) => {
    showMessage("Error al enviar el correo. Inténtalo de nuevo.", false);
    console.error("Error:", error);
  });
}

function generarCodigo() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function showMessage(msg, success) {
  const el = document.getElementById("mensaje");
  el.textContent = msg;
  el.style.color = success ? "green" : "red";
}

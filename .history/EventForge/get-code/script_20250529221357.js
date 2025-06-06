document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.href = '../registration/login.html';
  });
});

const code = sessionStorage.getItem("Codigo");
const mensaje = document.getElementById("mensaje");
const email = sessionStorage.getItem("Email");

window.addEventListener("DOMContentLoaded", () => {
  mensaje.textContent = `Mensaje de recuperación enviado a: ${email}`
});

console.log(code)

document.getElementById("button-code").addEventListener('click', () => {
  usuario = buscarUsuario()
  if (code == document.getElementById("codigo").value) {
    window.location.href = 'change-password/change-password.html'
  } else {
    alert ("Codigos diferentes");
  }
})

function buscarUsuario(){

}

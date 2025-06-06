document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.href = '../registration/login.html'; // Corregir ruta relativa
  });
});

const firebaseConfig = {
  apiKey: "AIzaSyBpq_htPz4UAL2P_QxJguS2ODFdT8mEK3w",
  authDomain: "eventforge-6df64.firebaseapp.com",
  databaseURL: "https://eventforge-6df64-default-rtdb.firebaseio.com",
  projectId: "eventforge-6df64",
  storageBucket: "eventforge-6df64.firebasestorage.app",
  messagingSenderId: "709211380182",
  appId: "1:709211380182:web:9b5825c809b9c7488aec77",
  measurementId: "G-WJWH2SC24V"
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Validar contraseña
function validarPassword(password) {
  const tieneLetra = /[a-zA-Z]/.test(password);
  const tieneNumero = /[0-9]/.test(password);
  return password.length >= 8 && tieneLetra && tieneNumero;
}

// Mostrar mensajes
function showMessage(msg, success) {
  const el = document.getElementById("mensaje");
  el.textContent = msg;
  el.style.color = success ? "green" : "red";
}

// Cambiar contraseña
function cambiarContraseña() {
  const emailGuardado = sessionStorage.getItem("Email");
  const nuevaPassword = document.getElementById("password").value.trim();
  const confirmPassword = document.getElementById("confirm-password").value.trim();

  if (!emailGuardado) {
    showMessage("No se encontró el email en sessionStorage.", false);
    return;
  }

  if (nuevaPassword !== confirmPassword) {
    showMessage("Las contraseñas no coinciden.", false);
    return;
  }

  if (!validarPassword(nuevaPassword)) {
    showMessage('La contraseña debe tener al menos 8 caracteres, una letra y un número.', false);
    return;
  }

  const usuariosRef = database.ref('usuarios');

  usuariosRef.once('value')
    .then(snapshot => {
      let usuarioKey = null;
      snapshot.forEach(childSnapshot => {
        const usuario = childSnapshot.val();
        if (usuario.email === emailGuardado) {
          usuarioKey = childSnapshot.key;
        }
      });

      if (usuarioKey) {
        database.ref('usuarios/' + usuarioKey).update({
          password: nuevaPassword
        })
        .then(() => {
          showMessage("Contraseña actualizada correctamente", true);
          setTimeout(() => {
            window.location.href = '../registration/login.html';
          }, 2000);
        })
        .catch(error => {
          showMessage("Error al actualizar la contraseña: " + error.message, false);
        });
      } else {
        showMessage('Usuario no encontrado con ese email.', false);
      }
    })
    .catch(error => {
      showMessage('Error al buscar usuario: ' + error.message, false);
    });
}

// Asignar evento al botón
document.getElementById("button-change-password").addEventListener('click', cambiarContraseña);

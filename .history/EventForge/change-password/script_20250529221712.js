document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.href = '../registration/login.html';
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
firebase.initializeApp(firebaseConfig);

function validar_contraseña_registro(inputElement) {
  const password = inputElement.value;
  const mensaje = document.getElementById('mensaje');

  const tieneLetra = /[a-zA-Z]/.test(password);
  const tieneNumero = /[0-9]/.test(password);

  if (password.length < 8 || !tieneLetra || !tieneNumero) {
    inputElement.style.border = '2px solid red';
    mensaje.textContent = 'La contraseña debe tener al menos 8 caracteres, una letra y un número.';
    return false;
  } else {
    inputElement.style.border = '2px solid green';
    mensaje.textContent = '';
    return true;
  }
}

const database = firebase.database();

function cambiar_contraseña() {
  const emailGuardado = sessionStorage.getItem("Email");
  const nuevaPassword = document.getElementById("password").value.trim();
  if (!emailGuardado) {
    showMessage("No se encontró el email en sessionStorage.", false);
    return;
  }

  // Validar nueva contraseña
  const tieneLetra = /[a-zA-Z]/.test(nuevaPassword);
  const tieneNumero = /[0-9]/.test(nuevaPassword);

  if (nuevaPassword.length < 8 || !tieneLetra || !tieneNumero) {
    showMessage('La contraseña debe tener al menos 8 caracteres, una letra y un número.', false);
    return;
  }

  const usuariosRef = database.ref('usuarios');

  // Buscar al usuario por su email
  usuariosRef.once('value')
    .then(snapshot => {
      let usuarioEncontrado = null;
      snapshot.forEach(childSnapshot => {
        const data = childSnapshot.val();
        if (data.email === emailGuardado) {
          usuarioEncontrado = childSnapshot.key;
        }
      });

      if (usuarioEncontrado) {
        // Actualizar contraseña
        database.ref('usuarios/' + usuarioEncontrado).update({
          password: nuevaPassword
        });
        window.location.href = '/registration/login.html'
      } else {
        showMessage('Usuario no encontrado con ese email.', false);
      }
    })
    .catch(error => {
      console.error(error);
      showMessage('Error al buscar usuario.', false);
    });
}

function showMessage(msg, success) {
  const el = document.getElementById("mensaje");
  el.textContent = msg;
  el.style.color = success ? "green" : "red";
}

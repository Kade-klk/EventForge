// script.js

const container = document.querySelector('.container');
const registerBtn = document.querySelector('.register-btn');
const loginBtn = document.querySelector('.login-btn');

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

// botón de registrarse
const registerButton = document.getElementById("button-register");

// botón de login
const loginButton = document.getElementById("button-login");

// Función para validar datos
function registrarUsuario() {
  const cedulaInput = document.getElementById("cedula-register");
  const usernameInput = document.getElementById("username-register");
  const emailInput = document.getElementById("email-register");
  const telefonoInput = document.getElementById("telefono-register");
  const passwordInput = document.getElementById("password-register");

  // Validar cédula
  validar_cedula_registro(cedulaInput, function(cedulaValida) {
    if (!cedulaValida) return;
    console.log("cedula valida");

    // Validar username
    validar_username_registro(usernameInput, function(usernameValido) {
      if (!usernameValido) return;
      console.log("username valida");

      // Validar email
      validar_email_registro(emailInput, function(emailValido) {
        if (!emailValido) return;
        console.log("email valida");

        // Validar teléfono
        validar_telefono_registro(telefonoInput, function(telefonoValido) {
          if (!telefonoValido) return;
          console.log("telefono valida");


          // Validar contraseña (retorna true/false, no callback)
          const passwordValida = validar_contraseña_registro(passwordInput);
          if (!passwordValida) return;
          console.log("password valida");


          // Si todas las validaciones pasaron, guardar el usuario
          const usuarioData = {
            username: usernameInput.value.trim(),
            email: emailInput.value.trim(),
            telefono: telefonoInput.value.trim(),
            password: passwordInput.value
          };

          firebase.database().ref("usuarios/" + cedulaInput.value.trim())
            .set(usuarioData)
            .then(() => {
              container.classList.remove('active');
              limpiarEspaciosRegistro();
              // Aquí limpiar formulario o redirigir si quieres
            })
            .catch((error) => {
              console.error("Error al guardar usuario:", error);
              alert("Error al guardar usuario: " + error.message);
            });
        });
      });
    });
  });
}


function validar_cedula_registro(inputElement, callback) {
  const cedula = inputElement.value.trim();
  const mensaje = document.getElementById("mensajeCedula");

  if (!/^\d+$/.test(cedula) || cedula.length !== 10) {
    inputElement.style.border = '2px solid red';
    mensaje.textContent = 'La cédula debe tener exactamente 10 números.';
    callback(false);
    return;
  }

  firebase.database().ref("usuarios/" + cedula).once("value")
    .then(function(snapshot) {
      const user = snapshot.val();
      if (user) {
        inputElement.style.border = '2px solid red';
        mensaje.textContent = 'El usuario con esa cédula ya existe.';
        callback(false);
      } else {
        inputElement.style.border = '2px solid green';
        mensaje.textContent = '';
        callback(true);
      }
    })
    .catch(function(error) {
      console.error("Error al verificar la cédula:", error);
      mensaje.textContent = 'Error al consultar la base de datos.';
      callback(false);
    });
}


function validar_telefono_registro(inputElement, callback) {
  const telefono = inputElement.value.trim();
  const mensaje = document.getElementById("mensajeTelefono");

  // Validación de formato
  if (telefono.length !== 10 || !/^\d+$/.test(telefono)) {
    inputElement.style.border = '2px solid red';
    mensaje.textContent = 'El teléfono debe ser numérico y tener 10 dígitos';
    callback(false);
    return;
  }

  // Consultar Firebase para ver si ya existe
  firebase.database().ref("usuarios").once("value")
    .then(function(snapshot) {
      const usuarios = snapshot.val();
      let telefonoExiste = false;

      for (let cedula in usuarios) {
        if (usuarios[cedula].telefono === telefono) {
          telefonoExiste = true;
          break;
        }
      }

      if (telefonoExiste) {
        inputElement.style.border = '2px solid red';
        mensaje.textContent = 'El teléfono ya está en uso';
        callback(false);
      } else {
        inputElement.style.border = '2px solid green';
        mensaje.textContent = '';
        callback(true);
      }
    })
    .catch(function(error) {
      console.error("Error al consultar Firebase:", error);
      mensaje.textContent = "Error al validar el teléfono.";
      callback(false);
    });
}

function validar_email_registro(inputElement, callback) {
  const email = inputElement.value.trim();
  const mensaje = document.getElementById("mensajeEmail");

  // Validación básica de formato
  const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regexEmail.test(email)) {
    inputElement.style.border = '2px solid red';
    mensaje.textContent = 'El correo no es válido';
    callback(false);
    return;
  }

  // Verificar en Firebase si el email ya existe
  firebase.database().ref("usuarios").once("value")
    .then(function(snapshot) {
      const usuarios = snapshot.val();
      let existe = false;

      for (let cedula in usuarios) {
        if (usuarios[cedula].email === email) {
          existe = true;
          break;
        }
      }

      if (existe) {
        inputElement.style.border = '2px solid red';
        mensaje.textContent = 'El correo ya está en uso';
        callback(false);
      } else {
        inputElement.style.border = '2px solid green';
        mensaje.textContent = '';
        callback(true);
      }
    })
    .catch(function(error) {
      console.error("Error al verificar email:", error);
      mensaje.textContent = 'Error al consultar la base de datos';
      callback(false);
    });
}

function validar_username_registro(inputElement, callback) {
  const username = inputElement.value.trim();
  const mensaje = document.getElementById("mensajeUsername");

  // Validación básica: mínimo 4 caracteres
  if (username.length < 4) {
    inputElement.style.border = '2px solid red';
    mensaje.textContent = 'El nombre de usuario debe tener al menos 4 caracteres';
    callback(false);
    return;
  }

  // Validación: debe contener al menos una letra
  const contieneLetra = /[a-zA-Z]/.test(username);
  if (!contieneLetra) {
    inputElement.style.border = '2px solid red';
    mensaje.textContent = 'El nombre de usuario debe contener al menos una letra';
    callback(false);
    return;
  }

  // Verificar en Firebase si el username ya existe
  firebase.database().ref("usuarios").once("value")
    .then(function(snapshot) {
      const usuarios = snapshot.val();
      let existe = false;

      for (let cedula in usuarios) {
        if (usuarios[cedula].username === username) {
          existe = true;
          break;
        }
      }

      if (existe) {
        inputElement.style.border = '2px solid red';
        mensaje.textContent = 'El nombre de usuario ya está en uso';
        callback(false);
      } else {
        inputElement.style.border = '2px solid green';
        mensaje.textContent = '';
        callback(true);
      }
    })
    .catch(function(error) {
      console.error("Error al verificar username:", error);
      mensaje.textContent = 'Error al consultar la base de datos';
      callback(false);
    });
}


function validar_contraseña_registro(inputElement) {
  const password = inputElement.value;
  const mensaje = document.getElementById('mensajePassword');
  
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


async function iniciarSesion() {
  const usernameLogin = document.getElementById("username-login").value.trim();
  const password = document.getElementById("password-login").value;
  const mensajeUsername = document.getElementById("mensajeUsernameLog");
  const mensajePassword = document.getElementById("mensajePasswordLog");

  if (!usernameLogin || !password) {
    alert("Por favor ingresa el nombre de usuario y contraseña.");
    return;
  }

  try {
    const snapshot = await firebase.database().ref("usuarios").once("value");
    const usuarios = snapshot.val();
    let usuarioEncontrado = null;

    for (let cedula in usuarios) {
      if (usuarios[cedula].username === usernameLogin) {
        cedulaEncontrada = cedula;
        usuarioEncontrado = usuarios[cedula];
        break;
      }
    }
    if (usuarioEncontrado) {
      mensajeUsername.textContent = '';
      document.getElementById("username-login").style.border = '2px solid green';
      if (usuarioEncontrado.password === password) {
        mensajePassword.textContent = '';
        document.getElementById("password-login").style.border = '2px solid green';
        console.log(`${usuarioEncontrado.username}`);
        sessionStorage.setItem("usernameLoged", usuarioEncontrado.username);
        sessionStorage.setItem("Cedula", cedulaEncontrada);
        window.location.href = "../index.html"; // o la ruta que uses

        // window.location.href = "dashboard.html";
      } else {
        mensajePassword.textContent = 'Contraseña incorrecta';
      }
    } else {
      mensajeUsername.textContent = 'Usuario no encontrado';
      document.getElementById("username-login").style.border = '2px solid red';
      return;
    }
  } catch (error) {
    console.error("Error al iniciar sesión:", error);
  }
}


function limpiarEspaciosRegistro() {
  // Campos
  document.getElementById("cedula-register").value = "";
  document.getElementById("cedula-register").style.border = 'none';
  document.getElementById("username-register").value = "";
  document.getElementById("username-register").style.border = 'none';
  document.getElementById("email-register").value = "";
  document.getElementById("email-register").style.border = 'none';
  document.getElementById("telefono-register").value = "";
  document.getElementById("telefono-register").style.border = 'none';
  document.getElementById("password-register").value = "";
  document.getElementById("password-register").style.border = 'none';

  //Mensajes
  document.getElementById("mensajeCedula").textContent = '';
  document.getElementById("mensajeUsername").textContent = '';
  document.getElementById("mensajeTelefono").textContent = '';
  document.getElementById("mensajeEmail").textContent = '';
  document.getElementById("mensajePassword").textContent = '';
}

function limpiarEspaciosLogin() {
  document.getElementById("username-login").value = "";
  document.getElementById("username-login").style.border = 'none';
  document.getElementById("password-login").value = "";
  document.getElementById("password-login").style.border = 'none';
  document.getElementById("mensajeUsernameLog").textContent = "";
  document.getElementById("mensajePasswordLog").textContent = "";
}

// Event Listeners para los botones de cambio de panel
registerBtn.addEventListener('click', () => {
  container.classList.add('active');
  limpiarEspaciosLogin();
});

loginBtn.addEventListener('click', () => {
  container.classList.remove('active');
  limpiarEspaciosRegistro();
});

// Asignar event listener al botón de registro
if (registerButton) {
  registerButton.addEventListener('click', registrarUsuario);
}

// Asignar event listener al botón de login
if (loginButton) {
  loginButton.addEventListener('click', iniciarSesion);
}

// Redirección al botón de cerrar
document.querySelectorAll('.close-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    window.location.href = '../index.html';
  });
});

// Asegurarse de que las transiciones funcionen correctamente al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  // Forzar un reflow para asegurar que las transiciones CSS se apliquen correctamente
  container.offsetHeight;
});

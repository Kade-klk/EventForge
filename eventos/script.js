// Firebase debe estar ya inicializado
const firebaseConfig = {
  apiKey: "AIzaSyBpq_htPz4UAL2P_QxJguS2ODFdT8mEK3w",
  authDomain: "eventforge-6df64.firebaseapp.com",
  databaseURL: "https://eventforge-6df64-default-rtdb.firebaseio.com",
  projectId: "eventforge-6df64",
  storageBucket: "eventforge-6df64.appspot.com",
  messagingSenderId: "709211380182",
  appId: "1:709211380182:web:9b5825c809b9c7488aec77"
};

const app = firebase.initializeApp(firebaseConfig);
const database = firebase.database();

document.getElementById('crearEventoForm').addEventListener('submit', function (e) {
  e.preventDefault();

  // Obtener inputs
  const tituloInput = document.getElementById('titulo');
  const descripcionInput = document.getElementById('descripcion');
  const lugarInput = document.getElementById('lugar');
  const fechaInput = document.getElementById('fechaEvento');
  const capacidadInput = document.getElementById('capacidad');
  const cedula = sessionStorage.getItem('Cedula');

  if (!cedula) {
    mostrarMensaje('Usuario no autenticado', false);
    return;
  }

  // Ejecutar validaciones
  validar_titulo(tituloInput);
  validar_descripcion(descripcionInput);
  validar_lugar(lugarInput);
  validar_fecha(fechaInput);
  validar_capacidad(capacidadInput);

  // Verificar si el formulario es válido
  if (
    !tituloInput.checkValidity() ||
    !descripcionInput.checkValidity() ||
    !lugarInput.checkValidity() ||
    !fechaInput.checkValidity() ||
    !capacidadInput.checkValidity()
  ) {
    mostrarMensaje('Corrige los errores en el formulario.', false);
    return;
  }

  const id_evento = Date.now(); // ID único
  const fecha_creacion = new Date().toISOString().split('T')[0];

  const [fecha, hora] = fechaInput.value.split('T');

  const nuevoEvento = {
    titulo: tituloInput.value.trim(),
    descripcion: descripcionInput.value.trim(),
    lugar: lugarInput.value.trim(),
    capacidad: capacidadInput.value,
    cedula,
    fecha_evento: fecha,
    hora,
    fecha_creacion
  };

  database.ref('eventos/' + id_evento).set(nuevoEvento)
    .then(() => {
      mostrarMensaje('Evento creado exitosamente', true);
      document.getElementById('crearEventoForm').reset();
      lim
    })
    .catch((error) => {
      console.error(error);
      mostrarMensaje('Error al crear el evento', false);
    });
});

function mostrarMensaje(msg, success) {
  const el = document.getElementById("mensaje");
  el.textContent = msg;
  el.style.color = success ? "green" : "red";
}

// Funciones de validación
function validar_titulo(input) {
  const valor = input.value.trim();
  const errorSpan = document.getElementById('error_titulo');

  if (valor.length < 3) {
    const msg = "El título debe tener al menos 3 caracteres.";
    input.setCustomValidity(msg);
    errorSpan.textContent = msg;
    input.classList.remove("valid");
    input.classList.add("invalid");
  } else {
    input.setCustomValidity("");
    errorSpan.textContent = "";
    input.classList.remove("invalid");
    input.classList.add("valid");
  }
}

function validar_descripcion(input) {
  const valor = input.value.trim();
  const errorSpan = document.getElementById('error_descripcion');

  if (valor.length < 10) {
    const msg = "La descripción debe tener al menos 10 caracteres.";
    input.setCustomValidity(msg);
    errorSpan.textContent = msg;
    input.classList.remove("valid");
    input.classList.add("invalid");
  } else {
    input.setCustomValidity("");
    errorSpan.textContent = "";
    input.classList.remove("invalid");
    input.classList.add("valid");
  }
}

function validar_lugar(input) {
  const valor = input.value.trim();
  const errorSpan = document.getElementById('error_lugar');

  if (valor.length < 3) {
    const msg = "El lugar debe tener al menos 3 caracteres.";
    input.setCustomValidity(msg);
    errorSpan.textContent = msg;
    input.classList.remove("valid");
    input.classList.add("invalid");
  } else {
    input.setCustomValidity("");
    errorSpan.textContent = "";
    input.classList.remove("invalid");
    input.classList.add("valid");
  }
}

function validar_fecha(input) {
  const valor = input.value;
  const errorSpan = document.getElementById('error_fechaEvento');

  const fechaIngresada = new Date(valor);
  const ahora = new Date();

  if (fechaIngresada < ahora) {
    const msg = "La fecha del evento debe ser futura.";
    input.setCustomValidity(msg);
    errorSpan.textContent = msg;
    input.classList.remove("valid");
    input.classList.add("invalid");
  } else {
    input.setCustomValidity("");
    errorSpan.textContent = "";
    input.classList.remove("invalid");
    input.classList.add("valid");
  }
}

function validar_capacidad(input) {
  const valor = parseInt(input.value);
  const errorSpan = document.getElementById('error_capacidad');

  if (isNaN(valor) || valor <= 0) {
    const msg = "La capacidad debe ser un número mayor a 0.";
    input.setCustomValidity(msg);
    errorSpan.textContent = msg;
    input.classList.remove("valid");
    input.classList.add("invalid");
  } else {
    input.setCustomValidity("");
    errorSpan.textContent = "";
    input.classList.remove("invalid");
    input.classList.add("valid");
  }
}

document.querySelectorAll('.btn-inscribirse').forEach(btn => {
      alert("Button click");
      btn.addEventListener('click', function () {
        const eventoId = this.getAttribute('data-id');
        const cedula = sessionStorage.getItem('Cedula');

        if (!cedula) {
          alert("Debes estar autenticado para inscribirte.");
          return;
        }

        const inscripcionRef = ref(database, `inscripciones/${eventoId}/${cedula}`);
        set(inscripcionRef, {
          cedula,
          fecha_inscripcion: new Date().toISOString()
        })
          .then(() => {
            alert("¡Inscripción exitosa!");
          })
          .catch((error) => {
            console.error("Error al inscribirse:", error);
            alert("Hubo un error al inscribirse.");
          });
      });
    });

function limpiarFormularioEvento() {
  // Inputs
  const inputs = [
    document.getElementById("titulo"),
    document.getElementById("descripcion"),
    document.getElementById("lugar"),
    document.getElementById("fechaEvento"),
    document.getElementById("capacidad")
  ];

  // Limpiar valores y clases
  inputs.forEach(input => {
    input.value = "";
    input.setCustomValidity("");
    input.classList.remove("valid", "invalid");
  });

  // Limpiar errores
  document.getElementById("error_titulo").textContent = "";
  document.getElementById("error_descripcion").textContent = "";
  document.getElementById("error_lugar").textContent = "";
  document.getElementById("error_fechaEvento").textContent = "";
  document.getElementById("error_capacidad").textContent = "";

  // Limpiar mensaje principal
  const mensaje = document.getElementById("mensaje");
  mensaje.textContent = "";
  mensaje.style.color = "";

  // Opcional: Resetear botón de crear/actualizar
  const boton = document.querySelector("#crearEventoForm button[type='submit']");
  if (boton) {
    boton.textContent = "Crear Evento";
    boton.dataset.id = ""; // útil si usas dataset.id para distinguir entre crear y actualizar
  }
}
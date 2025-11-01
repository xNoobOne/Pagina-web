// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore, collection, getDocs, addDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Configuración de Firebase (usa tu propia config)
const firebaseConfig = {
  apiKey: "AIzaSyChq2s4BLtk3fXjMMHJIcmzapglUdefCaU",
  authDomain: "proyecto-de-aula-316ea.firebaseapp.com",
  projectId: "proyecto-de-aula-316ea",
  storageBucket: "proyecto-de-aula-316ea.appspot.com",
  messagingSenderId: "216107665931",
  appId: "1:216107665931:web:7981be3907d4415673550e",
  measurementId: "G-H9150J1PE3"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Referencias a elementos del DOM
const eventsList = document.getElementById("eventsList");
const eventTemplate = document.getElementById("eventTemplate");
const noEventsMessage = document.getElementById("noEventsMessage");

// Esperar autenticación
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    // Redirigir si no está logueado
    window.location.href = "../html/login.html";
    return;
  }

  // Cargar eventos desde Firestore
  await cargarEventos(user.uid);
});

// Función que carga los eventos desde Firestore
async function cargarEventos(uidUsuario) {
  eventsList.innerHTML = `<p class="text-center text-muted">Cargando eventos...</p>`;

  try {
    const querySnapshot = await getDocs(collection(db, "eventos"));
    eventsList.innerHTML = "";

    if (querySnapshot.empty) {
      noEventsMessage.style.display = "block";
      return;
    }

    noEventsMessage.style.display = "none";

    querySnapshot.forEach((docSnap) => {
      const evento = docSnap.data();
      const idEvento = docSnap.id;

      // Clonar el template
      const clone = eventTemplate.content.cloneNode(true);

      // Asignar datos
      clone.querySelector(".event-title").textContent = evento.titulo || "Evento sin título";
      clone.querySelector(".presenter-name").textContent = evento.presentador || "No especificado";
      clone.querySelector(".event-hours strong").textContent = evento.horas || "0";
      clone.querySelector(".date-value").textContent = evento.fecha || "Sin fecha";
      clone.querySelector(".event-desc").textContent = evento.descripcion || "Sin descripción disponible";

      const btnInscribir = clone.querySelector(".btn-inscribir");
      btnInscribir.dataset.eventId = idEvento;

      // Acción al hacer clic en "INSCRÍBETE"
      btnInscribir.addEventListener("click", () => inscribirse(idEvento, uidUsuario));

      // Agregar al contenedor
      eventsList.appendChild(clone);
    });
  } catch (error) {
    console.error("Error al cargar eventos:", error);
    eventsList.innerHTML = `<p class="text-center text-danger">Error al cargar los eventos.</p>`;
  }
}

// Función de inscripción
async function inscribirse(eventoId, uidUsuario) {
  try {
    await addDoc(collection(db, "inscripciones"), {
      userId: uidUsuario,
      eventoId: eventoId,
      fechaInscripcion: new Date().toISOString()
    });

    alert(" Te has inscrito correctamente al evento.");
  } catch (error) {
    console.error("Error al inscribirse:", error);
    alert(" Ocurrió un error al intentar inscribirte.");
  }
}

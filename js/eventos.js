// js/eventos.js
// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import {
  getFirestore,
  collection,
  getDocs,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Configuración de Firebase
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

// Referencias al DOM
const eventsList = document.getElementById("eventsList");
const eventTemplate = document.getElementById("eventTemplate");
const noEventsMessage = document.getElementById("noEventsMessage");

// Escuchar autenticación
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    window.location.href = "../html/login.html";
    return;
  }
  await cargarEventos(user);
});

// Función para cargar los eventos desde Firestore
async function cargarEventos(currentUser) {
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

      // Clonar la plantilla
      const clone = eventTemplate.content.cloneNode(true);

      // Asignar datos del evento (usa los mismos nombres que guardas en regadmin.js)
      clone.querySelector(".event-title").textContent = evento.titulo || "Evento sin título";
      clone.querySelector(".presenter-name").textContent = evento.presentador || "No especificado";
      clone.querySelector(".event-hours strong").textContent = evento.horas ?? "0";
      clone.querySelector(".date-value").textContent = evento.fecha || "Sin fecha";
      clone.querySelector(".event-desc").textContent = evento.descripcion || "Sin descripción disponible";

      const btn = clone.querySelector(".btn-inscribir");
      btn.dataset.eventId = idEvento;

      // Acción del botón de inscripción
      btn.addEventListener("click", async () => {
        try {
          // Guardar inscripción en colección "inscripciones" con campos consistentes
          await addDoc(collection(db, "inscripciones"), {
            uidUsuario: currentUser.uid,
            nombreUsuario: currentUser.email,
            idEvento: idEvento,
            tituloEvento: evento.titulo || "Sin título",
            fechaEvento: evento.fecha || "Sin fecha",
            horas: evento.horas ?? 0,
            timestamp: serverTimestamp()
          });

          alert(`✅ Te has inscrito en el evento "${evento.titulo}".`);
        } catch (error) {
          console.error("Error al inscribirse:", error);
          alert("❌ Ocurrió un error al inscribirte. Intenta de nuevo.");
        }
      });

      eventsList.appendChild(clone);
    });
  } catch (error) {
    console.error("Error al cargar eventos:", error);
    eventsList.innerHTML = `<p class="text-danger text-center">Error al cargar los eventos.</p>`;
  }
}


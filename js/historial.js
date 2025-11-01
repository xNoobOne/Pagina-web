// js/historial.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Configuración de Firebase (misma en todo tu proyecto)
const firebaseConfig = {
  apiKey: "AIzaSyChq2s4BLtk3fXjMMHJIcmzapglUdefCaU",
  authDomain: "proyecto-de-aula-316ea.firebaseapp.com",
  projectId: "proyecto-de-aula-316ea",
  storageBucket: "proyecto-de-aula-316ea.appspot.com",
  messagingSenderId: "216107665931",
  appId: "1:216107665931:web:7981be3907d4415673550e",
  measurementId: "G-H9150J1PE3"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const historialBody = document.getElementById("historialBody");
const nombreUsuario = document.getElementById("nombreUsuario");
const totalHorasEl = document.getElementById("totalHoras");

// Esperar a que el usuario esté autenticado
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Por favor inicia sesión para ver tu historial.");
    window.location.href = "../html/login.html";
    return;
  }

  nombreUsuario.textContent = user.email || "Usuario";

  try {
    // Traer inscripciones del usuario
    const q = query(collection(db, "inscripciones"), where("uidUsuario", "==", user.uid));
    const querySnapshot = await getDocs(q);

    const inscripciones = [];
    let totalHoras = 0;

    querySnapshot.forEach((docSnap) => {
      const data = docSnap.data();

      // Normalizar timestamp
      let ts = null;
      if (data.timestamp && typeof data.timestamp.toDate === "function") {
        ts = data.timestamp.toDate();
      } else if (data.timestamp instanceof Date) {
        ts = data.timestamp;
      }

      const horas = Number(data.horas) || 0;
      totalHoras += horas;

      inscripciones.push({
        id: docSnap.id,
        ...data,
        horas,
        _tsDate: ts
      });
    });

    // Ordenar por fecha descendente
    inscripciones.sort((a, b) => {
      const at = a._tsDate ? a._tsDate.getTime() : 0;
      const bt = b._tsDate ? b._tsDate.getTime() : 0;
      return bt - at;
    });

    // Limpiar la tabla
    historialBody.innerHTML = "";

    if (inscripciones.length === 0) {
      historialBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No tienes eventos inscritos aún.</td></tr>`;
      totalHorasEl.textContent = "0";
      return;
    }

    // Mostrar las inscripciones
    inscripciones.forEach((evento) => {
      const actividad = evento.tituloEvento ?? evento.actividad ?? "-";
      const nombre = evento.nombreUsuario ?? evento.nombre ?? user.email ?? "-";
      const fecha = evento.fechaEvento ?? evento.fecha ?? "-";
      const hora = evento.hora ?? evento.horaEvento ?? "Sin hora";
      const fechaInscripcion = evento._tsDate ? evento._tsDate.toLocaleString() : "No disponible";

      const fila = `
        <tr>
          <td>${actividad}</td>
          <td>${nombre}</td>
          <td>${fecha}</td>
          <td>${hora}</td>
          <td>${evento.horas} <br><small style="color:#666">Inscrito: ${fechaInscripcion}</small></td>
        </tr>
      `;
      historialBody.innerHTML += fila;
    });

    // ✅ Mostrar total de horas
    totalHorasEl.textContent = totalHoras;

  } catch (error) {
    console.error("Error al cargar historial:", error);
    historialBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:red;">Error al cargar el historial.</td></tr>`;
    totalHorasEl.textContent = "0";
  }
});

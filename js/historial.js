// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore, collection, query, where, getDocs } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

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

const historialBody = document.getElementById("historialBody");
const nombreUsuario = document.getElementById("nombreUsuario");

// Detectar usuario logueado
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("Por favor inicia sesión para ver tu historial.");
    window.location.href = "../html/login.html";
    return;
  }

  nombreUsuario.textContent = user.email;

  try {
    // Consultar historial desde Firestore
    const q = query(collection(db, "inscripciones"), where("uid", "==", user.uid));
    const querySnapshot = await getDocs(q);

    historialBody.innerHTML = ""; // Limpiar tabla

    if (querySnapshot.empty) {
      historialBody.innerHTML = `<tr><td colspan="5" style="text-align:center;">No tienes eventos inscritos aún.</td></tr>`;
      return;
    }

    querySnapshot.forEach((doc) => {
      const evento = doc.data();
      const fila = `
        <tr>
          <td>${evento.actividad || "-"}</td>
          <td>${evento.nombre || "-"}</td>
          <td>${evento.fecha || "-"}</td>
          <td>${evento.hora || "-"}</td>
          <td>${evento.horas || "-"}</td>
        </tr>
      `;
      historialBody.innerHTML += fila;
    });

  } catch (error) {
    console.error("Error al cargar historial:", error);
    historialBody.innerHTML = `<tr><td colspan="5" style="text-align:center;color:red;">Error al cargar el historial.</td></tr>`;
  }
});

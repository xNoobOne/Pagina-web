// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore, doc, getDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

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

// Detectar usuario autenticado
onAuthStateChanged(auth, async (user) => {
  const nombreUsuarioSpan = document.getElementById("nombreUsuario");
  const nombreBienvenida = document.getElementById("nombreBienvenida");

  if (user) {
    const userDoc = await getDoc(doc(db, "usuarios", user.uid));
    if (userDoc.exists()) {
      const data = userDoc.data();
      const nombre = data.nombre || "Usuario";
      nombreUsuarioSpan.textContent = nombre;
      nombreBienvenida.textContent = nombre;
    } else {
      nombreUsuarioSpan.textContent = user.email;
      nombreBienvenida.textContent = user.email;
    }
  } else {
    // Si no hay usuario, redirigir al login
    window.location.href = "/html/login.html";
  }
});

// Cerrar sesión
document.getElementById("cerrarSesionBtn").addEventListener("click", async (e) => {
  e.preventDefault();
  try {
    await signOut(auth);
    alert("Has cerrado sesión correctamente.");
    window.location.href = "/index.html";
  } catch (error) {
    console.error("Error al cerrar sesión:", error.message);
  }
});

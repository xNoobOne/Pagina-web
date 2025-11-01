// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore, doc, getDoc, collection, addDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

// Configuración Firebase
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

// Verificar sesión y rol
onAuthStateChanged(auth, async (user) => {
  if (!user) {
    alert("⚠️ Debes iniciar sesión como administrador.");
    window.location.href = "/html/login.html";
    return;
  }

  try {
    const docRef = doc(db, "usuarios", user.uid);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
      alert(" No se encontró el perfil del usuario.");
      window.location.href = "/html/login.html";
      return;
    }

    const rol = docSnap.data().rol;

    if (rol !== "administrador") {
      alert(" Solo los administradores pueden registrar eventos.");
      window.location.href = "../html/inicio.html";
      return;
    }
  } catch (error) {
    console.error("Error al verificar rol:", error);
    alert("Error al verificar permisos.");
  }
});

// Capturar formulario
const form = document.getElementById("formEvento");

form?.addEventListener("submit", async (e) => {
  e.preventDefault();

  const titulo = document.getElementById("titulo").value.trim();
  const descripcion = document.getElementById("descripcion").value.trim();
  const presentador = document.getElementById("presentador").value.trim();
  const horas = parseInt(document.getElementById("horas").value);
  const fecha = document.getElementById("fecha").value;
  const imagen = document.getElementById("imagen").value.trim();

  if (!titulo || !descripcion || !presentador || !horas || !fecha) {
    alert("Por favor, completa todos los campos obligatorios.");
    return;
  }

  try {
    await addDoc(collection(db, "eventos"), {
      titulo,
      descripcion,
      presentador,
      horas,
      fecha,
      imagen: imagen || "",
      creado: new Date().toISOString()
    });

    alert(" Evento creado correctamente.");
    form.reset();
  } catch (error) {
    console.error("Error al crear evento:", error);
    alert(" Ocurrió un error al guardar el evento.");
  }
});

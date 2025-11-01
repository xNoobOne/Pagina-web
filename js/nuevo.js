// Importar Firebase
import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-auth.js";
import { getFirestore, doc, setDoc } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";

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

console.log(" Script de registro cargado correctamente");

// Escuchar formulario
document.getElementById("registroform").addEventListener("submit", async (e) => {
  e.preventDefault();
  console.log(" Formulario enviado correctamente");

  const nombre = document.getElementById("nombre").value.trim();
  const correo = document.getElementById("correo").value.trim();
  const usuario = document.getElementById("usuario").value.trim();
  const contraseña = document.getElementById("contraseña").value.trim();
  const confirmar = document.getElementById("confirmar").value.trim();

  if (!nombre || !correo || !usuario || !contraseña || !confirmar) {
    alert("Por favor completa todos los campos.");
    return;
  }

  if (contraseña !== confirmar) {
    alert("Las contraseñas no coinciden.");
    return;
  }

  //  Asignar rol automáticamente
  let rol = "usuario";
  if (
    nombre === "Administrador01" ||
    correo.toLowerCase() === "administrador01@gmail.com" ||
    usuario === "Administrador01"
  ) {
    rol = "administrador";
  }

  try {
    // Crear usuario en Firebase Authentication
    const credenciales = await createUserWithEmailAndPassword(auth, correo, contraseña);
    const user = credenciales.user;

    // Guardar información en Firestore
    await setDoc(doc(db, "usuarios", user.uid), {
      nombre,
      correo,
      usuario,
      rol
    });

    alert(` Cuenta creada exitosamente como ${rol}.`);
    window.location.href = "../html/login.html";
  } catch (error) {
    console.error(" Error al registrar:", error);
    alert("Error al registrar usuario: " + error.message);
  }
});

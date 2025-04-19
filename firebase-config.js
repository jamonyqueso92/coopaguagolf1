// Configuración de Firebase
const firebaseConfig = {
  apiKey: "TU_API_KEY", // Reemplazar con tu API key real
  authDomain: "TU_PROYECTO.firebaseapp.com", // Reemplazar con tu dominio
  projectId: "TU_PROYECTO", // Reemplazar con tu project ID
  storageBucket: "TU_PROYECTO.appspot.com", // Reemplazar con tu storage bucket
  messagingSenderId: "TU_MESSAGING_SENDER_ID", // Reemplazar con tu messaging sender ID
  appId: "TU_APP_ID" // Reemplazar con tu app ID
};

// Inicializar Firebase
firebase.initializeApp(firebaseConfig);

// Exportar funcionalidades que usaremos
const auth = firebase.auth();
const db = firebase.firestore();

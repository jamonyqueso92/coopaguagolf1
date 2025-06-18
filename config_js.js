// Configuración de Firebase
const firebaseConfig = {
    apiKey: "AIzaSyA3EwtirsHI_kwxMLH5SP2rXbm3vCYpqhg",
    authDomain: "coopaguagolf-b1e2f.firebaseapp.com",
    projectId: "coopaguagolf-b1e2f",
    storageBucket: "coopaguagolf-b1e2f.appspot.com",
    messagingSenderId: "980063915524",
    appId: "1:980063915524:web:e991b552b607d2447aef51",
    measurementId: "G-V6Z34N9V06"
};

// Inicializar Firebase
if (!firebase.apps || !firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}

// Referencias globales
const auth = firebase.auth();
const db = firebase.firestore();

// Variables globales del sistema
let currentUser = null;
let userProfile = null;
let perfilCompleto = false;
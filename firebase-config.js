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

// Inicializar Firebase solo si aún no se ha inicializado
if (!firebase.apps || !firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app(); // Si ya está inicializado, use la instancia actual
}

// Exportar funcionalidades que usaremos
const auth = firebase.auth();
const db = firebase.firestore();

// Objeto de utilidad para depuración
const FirebaseDebug = {
  checkAuth: function() {
    const user = firebase.auth().currentUser;
    console.log('Usuario actual:', user ? user.email : 'No hay usuario autenticado');
    return user;
  },
  
  getAuthState: function() {
    return new Promise((resolve) => {
      firebase.auth().onAuthStateChanged((user) => {
        console.log('Estado de autenticación:', user ? 'Autenticado' : 'No autenticado');
        resolve(user);
      });
    });
  }
};

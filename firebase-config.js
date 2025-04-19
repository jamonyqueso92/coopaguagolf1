// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA3EwtirsHI_kwxMLH5SP2rXbm3vCYpqhg",
  authDomain: "coopaguagolf-b1e2f.firebaseapp.com",
  projectId: "coopaguagolf-b1e2f",
  storageBucket: "coopaguagolf-b1e2f.firebasestorage.app",
  messagingSenderId: "980063915524",
  appId: "1:980063915524:web:e991b552b607d2447aef51",
  measurementId: "G-V6Z34N9V06"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

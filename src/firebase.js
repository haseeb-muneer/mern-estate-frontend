// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "mern-estate-99b4a.firebaseapp.com",
  projectId: "mern-estate-99b4a",
  storageBucket: "mern-estate-99b4a.firebasestorage.app",
  messagingSenderId: "1016971972000",
  appId: "1:1016971972000:web:834378473df2fa771c68c5",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);

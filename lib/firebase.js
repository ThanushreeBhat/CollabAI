// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCzZFFTlV80Gt_uzSPlZwDniO7bYzCR7rw",
  authDomain: "ai-notes-606e0.firebaseapp.com",
  projectId: "ai-notes-606e0",
  storageBucket: "ai-notes-606e0.firebasestorage.app",
  messagingSenderId: "603364562556",
  appId: "1:603364562556:web:d25a685dc6e724e64a1bf9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
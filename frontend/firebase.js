// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import {getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: "grab-your-meal.firebaseapp.com",
  projectId: "grab-your-meal",
  storageBucket: "grab-your-meal.firebasestorage.app",
  messagingSenderId: "689909823447",
  appId: "1:689909823447:web:0a4f2b79449c0514fd3d92",
  measurementId: "G-WK003W5XH4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth= getAuth(app);
export {app,auth};
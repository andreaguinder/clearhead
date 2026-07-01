import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, initializeAuth, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// 🌟 Detectamos si estamos ejecutando la app en desarrollo (localhost)
const isDevelopment = typeof window !== 'undefined' && window.location.hostname === 'localhost';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  // 🔄 Si es desarrollo usa el nativo de firebase, si es producción usa tu dominio de Vercel
  authDomain: isDevelopment ? "zylos-f9a69.firebaseapp.com" : "zylos-board.vercel.app",
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Inicializamos Auth adaptándonos al entorno
export const auth = getApps().length > 0 
  ? getAuth(app) 
  : initializeAuth(app, {
      persistence: browserLocalPersistence,
      // En desarrollo usamos el resolver por defecto para que funcione el popup/redirect local
      popupRedirectResolver: undefined 
    });

export const googleProvider = new GoogleAuthProvider();
export const db = getFirestore(app);
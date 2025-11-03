// Configuração do Firebase
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

// Configuração do Firebase - Projeto viva-pilates
const firebaseConfig = {
  apiKey: "AIzaSyBxXxXxXxXxXxXxXxXxXxXxXxXxXxXxXx", // Esta chave será obtida do Firebase Console
  authDomain: "viva-pilates.firebaseapp.com",
  projectId: "viva-pilates",
  storageBucket: "viva-pilates.appspot.com",
  messagingSenderId: "114135363946445691228",
  appId: "1:114135363946445691228:web:xxxxxxxxxxxxxxxxxxxxx" // Esta chave será obtida do Firebase Console
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);

// Inicializar serviços
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);

export default app;



import { getStorage } from "firebase/storage";
import { initializeApp } from "firebase/app";


const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_KEY,
  authDomain: "real-estate-c782f.firebaseapp.com",
  projectId: "real-estate-c782f",
  storageBucket: "real-estate-c782f.appspot.com",
  messagingSenderId: "338990842491",
  appId: "1:338990842491:web:449461c8ac4bb12b4918de"
};

// Initialize Firebase
 export const  app = initializeApp(firebaseConfig);
 export const storage=getStorage(app);


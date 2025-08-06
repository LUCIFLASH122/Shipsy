import { initializeApp } from "firebase/app";
import { getAuth, setPersistence, browserSessionPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDQVDxYsTBmnXukJyFV2whwCNmDeu2kR7k",
  authDomain: "product-3b8e8.firebaseapp.com",
  projectId: "product-3b8e8",
  storageBucket: "product-3b8e8.firebasestorage.app",
  messagingSenderId: "106504215233",
  appId: "1:106504215233:web:6a41b0442ee7d93923d240",
  measurementId: "G-5DYREQ65L5"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserSessionPersistence);
export const db = getFirestore(app);
export const storage = getStorage(app);
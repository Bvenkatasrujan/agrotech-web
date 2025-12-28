import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyDETBYXXyucEW_9Quv1-dp6ZL-G3VEjWY4",
    authDomain: "agrotech-ai-97ba9.firebaseapp.com",
    projectId: "agrotech-ai-97ba9",
    storageBucket: "agrotech-ai-97ba9.firebasestorage.app",
    messagingSenderId: "720256880480",
    appId: "1:720256880480:web:d646790e7e56cab39dd805"
};


const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

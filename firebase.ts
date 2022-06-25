import { initializeApp, getApp, getApps } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase configuration
const firebaseConfig = {
    apiKey: process.env.FIREBASE_KEY,
    authDomain: "firemania.firebaseapp.com",
    projectId: "firemania",
    storageBucket: "firemania.appspot.com",
    messagingSenderId: "372010537407",
    appId: process.env.FIREBASE_APP
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const db = getFirestore();
const storage = getStorage();

export default app;
export { db, storage }
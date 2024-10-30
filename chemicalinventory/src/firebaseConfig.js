// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore}  from "firebase/firestore"
import {getAuth} from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC--xK3e0l6c7EVZ1GDV2mfHLlVbIj_V0k",
  authDomain: "chemicallabinventory.firebaseapp.com",
  projectId: "chemicallabinventory",
  storageBucket: "chemicallabinventory.firebasestorage.app",
  messagingSenderId: "691457293184",
  appId: "1:691457293184:web:2216a5504a622b977e5f65"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
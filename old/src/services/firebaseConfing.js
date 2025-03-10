// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBWWPbrYZ00Lj4BgB1l0NqyueXL4Oqe8a0",
  authDomain: "imperioticket.firebaseapp.com",
  projectId: "imperioticket",
  storageBucket: "imperioticket.appspot.com",
  messagingSenderId: "88244167449",
  appId: "1:88244167449:web:5152076bc9e11da6995b88"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const db = getFirestore(app);

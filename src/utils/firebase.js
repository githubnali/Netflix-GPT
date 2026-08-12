// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBLjMJqpDnZwouGy2OHLQYttBAUk0jtXX8",
  authDomain: "netflixgpt-b9a7d.firebaseapp.com",
  projectId: "netflixgpt-b9a7d",
  storageBucket: "netflixgpt-b9a7d.firebasestorage.app",
  messagingSenderId: "428219703460",
  appId: "1:428219703460:web:854033ff1550185037c631",
  measurementId: "G-L33KDEJH2T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth();
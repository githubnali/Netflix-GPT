import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBLjMJqpDnZwouGy2OHLQYttBAUk0jtXX8",
  authDomain: "netflixgpt-b9a7d.firebaseapp.com",
  projectId: "netflixgpt-b9a7d",
  storageBucket: "netflixgpt-b9a7d.firebasestorage.app",
  messagingSenderId: "428219703460",
  appId: "1:428219703460:web:854033ff1550185037c631",
  measurementId: "G-L33KDEJH2T"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth();

// Deferred so `firebase/analytics` isn't in the initial bundle — it isn't needed for first paint.
export const initAnalytics = () => import("firebase/analytics").then(({ getAnalytics }) => getAnalytics(app));
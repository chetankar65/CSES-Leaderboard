// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA6Csemks00powjkOoN0Z-GMvebE-wQu_4",
  authDomain: "cses-leaderboard.firebaseapp.com",
  projectId: "cses-leaderboard",
  storageBucket: "cses-leaderboard.appspot.com",
  messagingSenderId: "920437558230",
  appId: "1:920437558230:web:39fd83b6248b4d1050b277",
  measurementId: "G-M27MHGN9RN"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
//const analytics = getAnalytics(app);
export const db = getFirestore();
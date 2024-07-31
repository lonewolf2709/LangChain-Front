import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth,GoogleAuthProvider,signInWithPopup} from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyDZC7Z88q4GbEUoKT3hInSCX67PIdaQAqE",
    authDomain: "ai-interviewer-58ee8.firebaseapp.com",
    projectId: "ai-interviewer-58ee8",
    storageBucket: "ai-interviewer-58ee8.appspot.com",
    messagingSenderId: "747691558111",
    appId: "1:747691558111:web:96084d4ceec7fa53ba956a",
    measurementId: "G-QQQ6Z9KXRW"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth=getAuth(app);
export const provider=new GoogleAuthProvider();
export const db = getFirestore(app);
const analytics = getAnalytics(app);
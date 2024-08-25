// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
// import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.FIREBASE_API_KEY,
  authDomain: "medical-bot-6cfa2.firebaseapp.com",
  databaseURL: "https://medical-bot-6cfa2-default-rtdb.firebaseio.com",
  projectId: "medical-bot-6cfa2",
  storageBucket: "medical-bot-6cfa2.appspot.com",
  messagingSenderId: "18178733946",
  appId: "1:18178733946:web:5bdf0ed930e476736b88c3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
// const analytics = getAnalytics(app);

const db = getFirestore(app);
export { db };

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAa19VQ6WBKe8_QnDYNFYTlBqZFyrwtybE",
  authDomain: "fitness-learning-app.firebaseapp.com",
  projectId: "fitness-learning-app",
  storageBucket: "fitness-learning-app.firebasestorage.app",
  messagingSenderId: "1095439196767",
  appId: "1:1095439196767:web:fb16ba00fcae34b7d571ea",
};

// Initialize Firebase
// const app = initializeApp(firebaseConfig);
const firebaseApp = initializeApp(firebaseConfig);
export default firebaseApp;

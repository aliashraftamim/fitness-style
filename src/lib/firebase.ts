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

// // src/lib/firebase.ts
// import { getAnalytics } from "firebase/analytics";
// import { getApp, getApps, initializeApp } from "firebase/app";

// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY!,
//   authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN!,
//   projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID!,
//   storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET!,
//   messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID!,
//   appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID!,
//   measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID!,
// };

// const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// export const analytics = () => {
//   if (typeof window !== "undefined") {
//     return getAnalytics(app);
//   }
//   return null;
// };

// export default app;

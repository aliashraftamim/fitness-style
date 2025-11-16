
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/8.8.0/firebase-messaging.js');


const firebaseConfig = {
  apiKey: "AIzaSyAa19VQ6WBKe8_QnDYNFYTlBqZFyrwtybE",
  authDomain: "fitness-learning-app.firebaseapp.com",
  projectId: "fitness-learning-app",
  storageBucket: "fitness-learning-app.firebasestorage.app",
  messagingSenderId: "1095439196767",
  appId: "1:1095439196767:web:fb16ba00fcae34b7d571ea",
  measurementId: "G-96RLF3NNTP",
};
 
// eslint-disable-next-line no-undef
firebase.initializeApp(firebaseConfig);
// eslint-disable-next-line no-undef


const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log('Background message received:', payload);
  
  const notificationTitle = payload.notification?.title || 'Notification';
  const notificationOptions = {
    body: payload.notification?.body || '',
    icon: '/firebase-logo.png' // আপনার icon path
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
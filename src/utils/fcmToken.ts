// src/utils/fcmToken.ts
import app from "@/lib/firebase";
import { getMessaging, getToken, isSupported } from "firebase/messaging";

export const getFcmToken = async (): Promise<string | null> => {
  console.log("Running getFcmToken...");

  // Check if running on server
  if (typeof window === "undefined") {
    console.log("Server-side, returning null");
    return null;
  }

  try {
    // Check if Firebase Messaging is supported
    const messagingSupported = await isSupported();
    if (!messagingSupported) {
      console.log("Firebase Messaging is not supported in this browser");
      return null;
    }

    // Request notification permission first
    const permission = await Notification.requestPermission();
    console.log("Notification permission:", permission);

    if (permission !== "granted") {
      console.log("Notification permission denied");
      return null;
    }

    // Register service worker
    if ("serviceWorker" in navigator) {
      const registration = await navigator.serviceWorker.register(
        "/firebase-messaging-sw.js"
      );
      console.log("Service Worker registered:", registration);

      // Wait for service worker to be ready
      await navigator.serviceWorker.ready;
    }

    // Get messaging instance (synchronous, not async)
    const messaging = getMessaging(app);
    console.log("Messaging instance:", messaging);

    // Get FCM token
    const currentToken = await getToken(messaging, {
      vapidKey: process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY,
    });

    if (currentToken) {
      console.log("✅ FCM Token:", currentToken);
      return currentToken;
    } else {
      console.log("⚠️ No registration token available.");
      return null;
    }
  } catch (err) {
    console.error("❌ Error retrieving FCM token:", err);
    return null;
  }
};

import { getMessaging, getToken, onMessage } from "firebase/messaging";
import { useEffect, useState } from "react";
import firebaseApp from "../lib/firebase";

const useFcmToken = () => {
  const [token, setToken] = useState("");
  const [notificationPermissionStatus, setNotificationPermissionStatus] =
    useState<NotificationPermission>("default");
  const [error, setError] = useState<string>("");

  useEffect(() => {
    const retrieveToken = async () => {
      try {
        console.log("🔍 Step 1: Checking environment...");
        
        // Check if we're in a browser environment - CRITICAL FIX
        if (typeof window === "undefined" || typeof navigator === "undefined") {
          console.log("⚠️ Not in browser environment (SSR)");
          return;
        }

        // Now check Service Worker support
        if (!("serviceWorker" in navigator)) {
          console.error("❌ Service Worker not supported in this browser");
          setError("Service Worker not supported");
          return;
        }

        console.log("✅ Environment check passed");

        // Check VAPID key
        const vapidKey = process.env.NEXT_PUBLIC_FIREBASE_VAPID_KEY;
        console.log("🔍 Step 2: Checking VAPID key...");
        if (!vapidKey) {
          console.error("❌ VAPID key is missing!");
          console.error("Please add NEXT_PUBLIC_FIREBASE_VAPID_KEY to your .env.local file");
          setError("VAPID key not configured");
          return;
        }
        console.log("✅ VAPID key found:", vapidKey.substring(0, 20) + "...");

        // Request notification permission
        console.log("🔍 Step 3: Requesting notification permission...");
        const permission = await Notification.requestPermission();
        setNotificationPermissionStatus(permission);
        console.log("📋 Permission status:", permission);

        if (permission !== "granted") {
          console.error("❌ Notification permission denied");
          setError("Notification permission denied");
          return;
        }
        console.log("✅ Notification permission granted");

        // Register service worker
        console.log("🔍 Step 4: Registering service worker...");
        let registration;
        try {
          registration = await navigator.serviceWorker.register(
            "/firebase-messaging-sw.js"
          );
          console.log("✅ Service Worker registered successfully");
          console.log("Service Worker scope:", registration.scope);
        } catch (swError: any) {
          console.error("❌ Service Worker registration failed:", swError);
          console.error("Make sure firebase-messaging-sw.js exists in your public folder");
          setError(`Service Worker registration failed: ${swError.message}`);
          return;
        }

        // Wait for service worker to be ready
        console.log("🔍 Step 5: Waiting for service worker to be ready...");
        await navigator.serviceWorker.ready;
        console.log("✅ Service Worker is ready");

        // Get messaging instance
        console.log("🔍 Step 6: Getting Firebase messaging instance...");
        const messaging = getMessaging(firebaseApp);
        console.log("✅ Messaging instance created");

        // Get FCM token
        console.log("🔍 Step 7: Requesting FCM token...");
        const currentToken = await getToken(messaging, {
          vapidKey: vapidKey,
          serviceWorkerRegistration: registration,
        });

        if (currentToken) {
          console.log("✅✅✅ FCM Token retrieved successfully! ✅✅✅");
          console.log("🎉 Token:", currentToken);
          setToken(currentToken);
        } else {
          console.error("❌ No FCM token received");
          console.error("This might be a Firebase configuration issue");
          setError("Failed to retrieve FCM token");
        }

        // Listen for foreground messages
        onMessage(messaging, (payload) => {
          console.log("📨 Message received in foreground:", payload);
        });

      } catch (error: any) {
        console.error("❌❌❌ Error in FCM token retrieval ❌❌❌");
        console.error("Error details:", error);
        console.error("Error message:", error.message);
        console.error("Error code:", error.code);
        setError(error.message || "Unknown error occurred");
      }
    };

    // Only run in browser
    if (typeof window !== "undefined") {
      retrieveToken();
    }
  }, []);

  console.log("📊 Current State - Token:", token ? "Available ✅" : "Not available ❌");
  if (error) {
    console.log("📊 Error:", error);
  }

  return { 
    fcmToken: token, 
    notificationPermissionStatus,
    error 
  };
};

export default useFcmToken;
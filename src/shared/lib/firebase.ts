import { initializeApp, getApps, type FirebaseApp } from 'firebase/app'; // Import getApps
import {
  getAuth,
  signInAnonymously,
  onAuthStateChanged,
  type Auth,
  type User
} from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// This reads from the .env.local file (VITE_... variables)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// --- Initialize Firebase (with HMR guard) ---
let app: FirebaseApp;
let authInstance: Auth;
let dbInstance: Firestore;
let storageInstance: FirebaseStorage;

// Check if Firebase keys are provided
const cloudEnabled = !!(
  firebaseConfig.apiKey &&
  firebaseConfig.projectId &&
  firebaseConfig.authDomain
);

if (cloudEnabled) {
  // Only initialize if no apps exist yet
  if (getApps().length === 0) {
    app = initializeApp(firebaseConfig);
  } else {
    app = getApps()[0]; // Use the existing app
  }
  authInstance = getAuth(app);
  dbInstance = getFirestore(app);
  storageInstance = getStorage(app);
} else {
  console.warn("Firebase config missing. Running in local-only mode.");
  // Assign dummy/null values or handle appropriately if needed
}

// Export Firebase services (use the initialized instances)
export const auth = authInstance;
export const db = dbInstance;
export const storage = storageInstance;

// Function to ensure user is signed in (anonymously)
export const ensureAnonAuth = (): Promise<User | null> => {
  // Return null immediately if cloud is not enabled
  if (!cloudEnabled || !auth) {
    return Promise.resolve(null);
  }

  return new Promise((resolve, reject) => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe(); // Stop listening after we get the first response
      if (user) {
        resolve(user);
      } else {
        signInAnonymously(auth)
          .then((userCredential) => resolve(userCredential.user))
          .catch(reject);
      }
    });
  });
};

import { initializeApp } from 'firebase/app';
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signOut,
  updateProfile,
} from 'firebase/auth';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);

// Auth Providers
export const googleProvider = new GoogleAuthProvider();
export const facebookProvider = new FacebookAuthProvider();

/**
 * Helper to format Firebase error codes into clear, user-friendly messages
 */
export const formatFirebaseError = (error) => {
  if (!error) return 'An error occurred during authentication.';
  const code = error.code || '';
  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please check your credentials or sign up.';
    case 'auth/email-already-in-use':
      return 'This email address is already registered. Please sign in instead.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/weak-password':
      return 'Password should be at least 6 characters.';
    case 'auth/user-disabled':
      return 'This user account has been disabled.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in popup was closed before completing.';
    default:
      return error.message || 'Firebase Authentication failed.';
  }
};

/**
 * Real Firebase Email/Password Sign In
 */
export const loginWithEmail = async (email, password) => {
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    displayName: userCredential.user.displayName || email.split('@')[0],
    photoURL: userCredential.user.photoURL,
  };
};

/**
 * Real Firebase User Registration
 */
export const registerWithEmail = async (email, password, displayName, phone) => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  if (displayName) {
    await updateProfile(userCredential.user, { displayName });
  }
  return {
    uid: userCredential.user.uid,
    email: userCredential.user.email,
    displayName: displayName || userCredential.user.displayName || email.split('@')[0],
    phone: phone || null,
    photoURL: userCredential.user.photoURL,
  };
};

/**
 * Real Firebase Google Popup Sign In
 */
export const loginWithGoogle = async () => {
  const result = await signInWithPopup(auth, googleProvider);
  return {
    uid: result.user.uid,
    email: result.user.email,
    displayName: result.user.displayName,
    photoURL: result.user.photoURL,
  };
};

/**
 * Real Firebase Facebook Popup Sign In
 */
export const loginWithFacebook = async () => {
  const result = await signInWithPopup(auth, facebookProvider);
  return {
    uid: result.user.uid,
    email: result.user.email,
    displayName: result.user.displayName,
    photoURL: result.user.photoURL,
  };
};

/**
 * Real Firebase Sign Out
 */
export const logoutUser = async () => {
  await signOut(auth);
};

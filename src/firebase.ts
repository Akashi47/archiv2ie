import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User,
  signInWithEmailAndPassword
} from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const getEnvVal = (val: any): string | undefined => {
  if (val === undefined || val === null) return undefined;
  const s = String(val).trim();
  if (s === "" || s === "undefined" || s === "null") return undefined;
  return s;
};

const overriddenProjectId = getEnvVal(import.meta.env.VITE_FIREBASE_PROJECT_ID);
const overriddenApiKey = getEnvVal(import.meta.env.VITE_FIREBASE_API_KEY);

const isProjectOverridden = 
  !!overriddenProjectId || 
  !!overriddenApiKey ||
  (typeof window !== 'undefined' && 
   !window.location.hostname.includes('ai-studio') && 
   !window.location.hostname.includes('run.app') && 
   !window.location.hostname.includes('localhost') && 
   !window.location.hostname.includes('127.0.0.1'));

const projectId = overriddenProjectId || firebaseConfig.projectId;

const activeConfig = {
  projectId: projectId,
  apiKey: overriddenApiKey || firebaseConfig.apiKey,
  authDomain: getEnvVal(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN) || 
              (overriddenProjectId ? `${projectId}.firebaseapp.com` : firebaseConfig.authDomain),
  storageBucket: getEnvVal(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET) || 
                 (overriddenProjectId ? `${projectId}.firebasestorage.app` : firebaseConfig.storageBucket),
  messagingSenderId: getEnvVal(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID) || firebaseConfig.messagingSenderId,
  appId: getEnvVal(import.meta.env.VITE_FIREBASE_APP_ID) || firebaseConfig.appId,
};

// Mask sensitive values for safe logging
const maskedApiKey = activeConfig.apiKey ? `${activeConfig.apiKey.slice(0, 6)}...` : 'undefined';
const maskedAppId = activeConfig.appId ? `${activeConfig.appId.slice(0, 10)}...` : 'undefined';

console.log("[Firebase Init] Active Configuration:", {
  projectId: activeConfig.projectId,
  authDomain: activeConfig.authDomain,
  storageBucket: activeConfig.storageBucket,
  messagingSenderId: activeConfig.messagingSenderId,
  apiKey: maskedApiKey,
  appId: maskedAppId,
  isProjectOverridden,
});

const app = initializeApp(activeConfig);
const auth = getAuth(app);

const dbId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || (isProjectOverridden ? '' : firebaseConfig.firestoreDatabaseId);
const db = dbId ? getFirestore(app, dbId) : getFirestore(app);

const provider = new GoogleAuthProvider();
provider.addScope('https://www.googleapis.com/auth/drive');
provider.addScope('https://www.googleapis.com/auth/userinfo.email');

// Configured admin email
export const ADMIN_EMAIL = 'eyuaelijah@gmail.com';

let cachedAccessToken: string | null = null;
let isSigningIn = false;

export const initAuth = (
  onAuthSuccess?: (user: User, token: string | null) => void,
  onAuthFailure?: () => void
) => {
  return onAuthStateChanged(auth, async (user: User | null) => {
    if (user) {
      if (onAuthSuccess) {
        onAuthSuccess(user, cachedAccessToken);
      }
    } else {
      cachedAccessToken = null;
      if (onAuthFailure) onAuthFailure();
    }
  });
};

export const googleSignIn = async (): Promise<{ user: User; accessToken: string | null } | null> => {
  try {
    isSigningIn = true;
    const result = await signInWithPopup(auth, provider);
    const credential = GoogleAuthProvider.credentialFromResult(result);
    const token = credential?.accessToken || null;
    if (token) {
      cachedAccessToken = token;
    }
    return { user: result.user, accessToken: token };
  } catch (error: any) {
    console.error('Erreur de connexion:', error);
    throw error;
  } finally {
    isSigningIn = false;
  }
};

export const emailSignIn = async (email: string, pass: string): Promise<User | null> => {
  try {
    const result = await signInWithEmailAndPassword(auth, email, pass);
    return result.user;
  } catch (error: any) {
    console.error('Erreur de connexion par email:', error);
    throw error;
  }
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export { auth, db, provider };

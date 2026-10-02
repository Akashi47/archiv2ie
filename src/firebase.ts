import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signOut,
  User,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  updateDoc, 
  onSnapshot 
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { UserProfile, FavoriteItem, HistoryItem } from './types';

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

const dbId = import.meta.env.VITE_FIREBASE_FIRESTORE_DATABASE_ID || (isProjectOverridden ? '' : (firebaseConfig as any).firestoreDatabaseId);
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

export const emailSignUp = async (email: string, pass: string, displayName: string, filiere?: string, semestre?: string): Promise<User | null> => {
  try {
    const result = await createUserWithEmailAndPassword(auth, email, pass);
    if (result.user && displayName) {
      await updateProfile(result.user, { displayName });
    }
    // Create initial profile in Firestore
    if (result.user) {
      await syncUserProfile(result.user, {
        displayName: displayName || result.user.email?.split('@')[0] || 'Étudiant 2iE',
        filiere: (filiere as any) || '',
        semestre: semestre || ''
      });
    }
    return result.user;
  } catch (error: any) {
    console.error('Erreur de création de compte:', error);
    throw error;
  }
};

export const resetPassword = async (email: string): Promise<void> => {
  try {
    await sendPasswordResetEmail(auth, email);
  } catch (error: any) {
    console.error('Erreur de réinitialisation du mot de passe:', error);
    throw error;
  }
};

export const syncUserProfile = async (
  user: User, 
  additionalData?: Partial<UserProfile>
): Promise<UserProfile> => {
  if (!user) throw new Error("Utilisateur non connecté");
  const userRef = doc(db, 'users', user.uid);
  try {
    const snap = await getDoc(userRef);
    const now = new Date().toISOString();
    
    if (!snap.exists()) {
      const newProfile: UserProfile = {
        uid: user.uid,
        email: user.email || '',
        displayName: user.displayName || additionalData?.displayName || user.email?.split('@')[0] || 'Étudiant 2iE',
        photoURL: user.photoURL || '',
        filiere: additionalData?.filiere || '',
        semestre: additionalData?.semestre || '',
        promotion: additionalData?.promotion || '',
        favorites: [],
        recentHistory: [],
        createdAt: now,
        updatedAt: now
      };
      await setDoc(userRef, newProfile);
      return newProfile;
    } else {
      const currentData = snap.data() as UserProfile;
      const updatedData: Partial<UserProfile> = {
        updatedAt: now,
        displayName: user.displayName || currentData.displayName || additionalData?.displayName,
        photoURL: user.photoURL || currentData.photoURL,
        ...additionalData
      };
      await updateDoc(userRef, updatedData);
      return { ...currentData, ...updatedData };
    }
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `users/${user.uid}`);
    throw error;
  }
};

export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  try {
    const userRef = doc(db, 'users', uid);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data() as UserProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, `users/${uid}`);
    return null;
  }
};

export const subscribeUserProfile = (uid: string, callback: (profile: UserProfile | null) => void) => {
  const userRef = doc(db, 'users', uid);
  return onSnapshot(userRef, (snap) => {
    if (snap.exists()) {
      callback(snap.data() as UserProfile);
    } else {
      callback(null);
    }
  }, (error) => {
    console.error("Erreur de suivi du profil:", error);
  });
};

export const toggleUserFavorite = async (uid: string, item: Omit<FavoriteItem, 'addedAt'>): Promise<boolean> => {
  const userRef = doc(db, 'users', uid);
  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) return false;
    const profile = snap.data() as UserProfile;
    const currentFavorites = profile.favorites || [];
    const exists = currentFavorites.some(f => f.id === item.id || f.driveKey === item.driveKey);
    
    let updatedFavorites: FavoriteItem[];
    let isNowFavorite = false;

    if (exists) {
      updatedFavorites = currentFavorites.filter(f => f.id !== item.id && f.driveKey !== item.driveKey);
      isNowFavorite = false;
    } else {
      const newFav: FavoriteItem = {
        ...item,
        addedAt: new Date().toISOString()
      };
      updatedFavorites = [newFav, ...currentFavorites];
      isNowFavorite = true;
    }

    await updateDoc(userRef, {
      favorites: updatedFavorites,
      updatedAt: new Date().toISOString()
    });

    return isNowFavorite;
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, `users/${uid}`);
    return false;
  }
};

export const recordDocumentView = async (uid: string, historyItem: Omit<HistoryItem, 'viewedAt'>): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  try {
    const snap = await getDoc(userRef);
    if (!snap.exists()) return;
    const profile = snap.data() as UserProfile;
    const currentHistory = profile.recentHistory || [];
    
    // Remove if already in history, add to front, limit to 20
    const filtered = currentHistory.filter(h => h.id !== historyItem.id && h.driveKey !== historyItem.driveKey);
    const newEntry: HistoryItem = {
      ...historyItem,
      viewedAt: new Date().toISOString()
    };
    const updatedHistory = [newEntry, ...filtered].slice(0, 20);

    await updateDoc(userRef, {
      recentHistory: updatedHistory,
      updatedAt: new Date().toISOString()
    });
  } catch (error) {
    // Non-blocking history record
    console.warn("Could not record document view:", error);
  }
};

export const logout = async () => {
  await signOut(auth);
  cachedAccessToken = null;
};

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export { auth, db, provider };

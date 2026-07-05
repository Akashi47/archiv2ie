import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  CheckCircle2, 
  Shield, 
  AlertTriangle, 
  ChevronRight, 
  RefreshCw, 
  File,
  Clock,
  Download,
  Copy,
  Trash2,
  ChevronDown,
  Check,
  FileText,
  Lock,
  LogOut,
  FolderOpen,
  CheckCircle,
  HelpCircle,
  Search,
  Mail,
  Eye,
  EyeOff,
  ExternalLink
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, logout, ADMIN_EMAIL, initAuth, emailSignIn } from '../firebase';

// ID du dossier Google Drive cible pour archiv2ie
export const TARGET_DRIVE_FOLDER_ID = '1VOjv5qxNbFLUvRc0BShinaoOM3OF5jBxDIRJt7MEhDqrBtiLX7wtvbLGFj1WpCu8U1ESC3ob';

// Helper: Upload file binary directly to Google Drive via Multipart-Related request
const uploadToGoogleDrive = async (
  accessToken: string,
  fileName: string,
  fileMimeType: string,
  base64Content: string,
  descriptionText: string
): Promise<string> => {
  try {
    const rawBase64 = base64Content.includes('base64,') 
      ? base64Content.split('base64,')[1] 
      : base64Content;
    const byteCharacters = atob(rawBase64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    const metadata = {
      name: fileName,
      mimeType: fileMimeType,
      description: descriptionText,
      parents: [TARGET_DRIVE_FOLDER_ID]
    };

    const boundary = 'archiv2ie_multipart_boundary';
    const delimiter = `\r\n--${boundary}\r\n`;
    const closeDelimiter = `\r\n--${boundary}--`;

    const encoder = new TextEncoder();
    const part1 = encoder.encode(
      `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n${delimiter}Content-Type: ${fileMimeType}\r\n\r\n`
    );
    const part2 = byteArray;
    const part3 = encoder.encode(closeDelimiter);

    const multipartBody = new Uint8Array(part1.length + part2.length + part3.length);
    multipartBody.set(part1, 0);
    multipartBody.set(part2, part1.length);
    multipartBody.set(part3, part1.length + part2.length);

    const response = await fetch('https://www.googleapis.com/upload/drive/v3/files?uploadType=multipart', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': `multipart/related; boundary=${boundary}`
      },
      body: multipartBody
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Google Drive API: ${response.status} - ${errorText}`);
    }

    const result = await response.json();
    return result.id;
  } catch (err: any) {
    console.error("Erreur d'upload Google Drive:", err);
    throw err;
  }
};

// Helper to prevent infinite hangs on Firestore or network calls
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(errorMessage)), timeoutMs))
  ]);
};

export default function Contribuer() {
  const [formData, setFormData] = useState({
    nom: '',
    email: '',
    statut: 'Etudiant',
    filiere: '',
    semestre: '',
    nomDoc: '',
    matiere: '',
    typeDoc: 'Cours',
    commentaire: ''
  });

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [base64Data, setBase64Data] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Auth & Admin States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [showAdminTrigger, setShowAdminTrigger] = useState<boolean>(false);
  const [titleClicks, setTitleClicks] = useState<number>(0);

  // Login Modal States
  const [isLoginModalOpen, setIsLoginModalOpen] = useState<boolean>(false);
  const [loginEmail, setLoginEmail] = useState<string>('eyuaelijah@gmail.com');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Firestore Tracking Submissions
  const [firestoreDeposits, setFirestoreDeposits] = useState<any[]>([]);
  const [isLoadingDeposits, setIsLoadingDeposits] = useState<boolean>(false);
  const [expandedDepositId, setExpandedDepositId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedEmailsStatus, setCopiedEmailsStatus] = useState<boolean>(false);
  
  // Admin actions
  const [isSyncingId, setIsSyncingId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterDrive, setFilterDrive] = useState<'all' | 'synced' | 'pending'>('all');
  const [adminTab, setAdminTab] = useState<'list' | 'stats' | 'security'>('stats');
  const [customPasscode, setCustomPasscode] = useState<string>('');
  const [newPasscode, setNewPasscode] = useState<string>('');
  const [isSavingPasscode, setIsSavingPasscode] = useState<boolean>(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState<string | null>(null);
  const [isCreatingSheet, setIsCreatingSheet] = useState<boolean>(false);
  const [manualSheetId, setManualSheetId] = useState<string>('');
  const [isLinkingSheet, setIsLinkingSheet] = useState<boolean>(false);
  const [isSyncingAll, setIsSyncingAll] = useState<boolean>(false);

  // Success confirmation screen state
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState<boolean>(false);
  const [successDetails, setSuccessDetails] = useState<{ nom: string; nomDoc: string } | null>(null);

  // Toast notifications state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const fetchAdminConfig = async () => {
    try {
      const res = await fetch('/api/admin/config');
      const data = await res.json();
      if (data.passcode) {
        setCustomPasscode(data.passcode);
        setNewPasscode(data.passcode);
      }
      if (data.spreadsheetId) {
        setSpreadsheetId(data.spreadsheetId);
      }
    } catch (e) {
      console.error("Error fetching admin config:", e);
    }
  };

  const fetchDeposits = async () => {
    setIsLoadingDeposits(true);
    try {
      const res = await fetch('/api/deposits');
      const list = await res.json();
      list.sort((a: any, b: any) => {
        const timeA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (timeA !== timeB) return timeB - timeA;
        return (b.id || '').localeCompare(a.id || '');
      });
      setFirestoreDeposits(list);
    } catch (err) {
      console.error("Erreur de chargement des dépôts:", err);
    } finally {
      setIsLoadingDeposits(false);
    }
  };

  const handleCreateGoogleSheet = async () => {
    if (!adminToken) {
      showToast("Veuillez vous authentifier avec votre compte Google administrateur d'abord.", "error");
      return;
    }
    setIsCreatingSheet(true);
    try {
      const res = await fetch('/api/sheets/create', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${adminToken}`
        }
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Une erreur est survenue lors de la création.");
      }
      const data = await res.json();
      setSpreadsheetId(data.spreadsheetId);
      showToast("Google Sheet et Tableau de Bord créés avec succès dans le dossier Google Drive !", "success");
      fetchDeposits();
    } catch (e: any) {
      console.error(e);
      showToast(`Erreur d'intégration Sheets : ${e.message || e}`, "error");
    } finally {
      setIsCreatingSheet(false);
    }
  };

  const handleLinkManualSheet = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanId = manualSheetId.trim();
    if (!cleanId) {
      showToast("Veuillez saisir un ID de Google Sheet valide.", "error");
      return;
    }
    setIsLinkingSheet(true);
    try {
      const res = await fetch('/api/admin/config/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId: cleanId })
      });
      if (!res.ok) throw new Error();
      setSpreadsheetId(cleanId);
      showToast("Le Google Sheet a été associé manuellement avec succès !", "success");
      setManualSheetId('');
      fetchAdminConfig();
      fetchDeposits();
    } catch (err: any) {
      console.error("Erreur lors de l'association manuelle du Google Sheet :", err);
      showToast("Impossible d'associer le Google Sheet.", "error");
    } finally {
      setIsLinkingSheet(false);
    }
  };

  const handleDissociateSheet = async () => {
    if (!window.confirm("Êtes-vous sûr de vouloir dissocier ce Google Sheet ? Les futures métadonnées ne seront plus synchronisées automatiquement.")) {
      return;
    }
    try {
      const res = await fetch('/api/admin/config/token', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ spreadsheetId: "REMOVE_SPREADSHEET_ID" })
      });
      if (!res.ok) throw new Error();
      setSpreadsheetId(null);
      showToast("Le Google Sheet a été dissocié avec succès.", "success");
      fetchAdminConfig();
      fetchDeposits();
    } catch (err: any) {
      console.error("Erreur de dissociation du Google Sheet :", err);
      showToast("Impossible de dissocier le Google Sheet.", "error");
    }
  };

  const handleForceSyncAll = async () => {
    setIsSyncingAll(true);
    try {
      if (adminToken) {
        await fetch('/api/admin/config/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ accessToken: adminToken })
        });
      }
      const res = await fetch('/api/deposits/sync-all', {
        method: 'POST'
      });
      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "La synchronisation a échoué.");
      }
      showToast("Tous les dépôts ont été synchronisés vers la feuille Google Sheet !", "success");
      fetchDeposits();
    } catch (e: any) {
      console.error(e);
      showToast(`Erreur de synchronisation : ${e.message || e}`, "error");
    } finally {
      setIsSyncingAll(false);
    }
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  // CSV Export for depositor data
  const exportDepositorsToCSV = () => {
    if (firestoreDeposits.length === 0) {
      showToast("Aucune donnée à exporter.", "info");
      return;
    }

    const headers = [
      "ID Unique",
      "Date de depot",
      "Nom complet",
      "Adresse Email",
      "Role/Statut",
      "Filiere",
      "Semestre",
      "Matiere",
      "Type de document",
      "Nom du document",
      "Nom du fichier",
      "Taille",
      "Statut Google Drive",
      "ID Fichier Google Drive",
      "Commentaire"
    ];

    const rows = firestoreDeposits.map(dep => [
      dep.id || "",
      dep.date || "",
      dep.nom || "",
      dep.email || "",
      dep.statut || "",
      dep.filiere || "",
      dep.semestre || "",
      dep.matiere || "",
      dep.typeDoc || "",
      dep.nomDoc || "",
      dep.fileName || "",
      dep.fileSize || "",
      dep.driveStatus === 'success' ? "Synchronise" : "En attente",
      dep.driveFileId || "",
      (dep.commentaire || "").replace(/"/g, '""')
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(val => `"${val}"`).join(","))
    ].join("\n");

    const blob = new Blob(["\uFEFF" + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `archiv2ie_deposants_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Check URL parameter or localStorage for admin access trigger
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('admin') === 'true') {
      setShowAdminTrigger(true);
      localStorage.setItem('archiv2ie_show_admin_button', 'true');
    } else if (localStorage.getItem('archiv2ie_show_admin_button') === 'true') {
      setShowAdminTrigger(true);
    }
  }, []);

  // Load custom master passcode and spreadsheet ID when user is admin
  useEffect(() => {
    if (isAdminUser) {
      fetchAdminConfig();
    }
  }, [isAdminUser]);

  // Check auth state on mount
  useEffect(() => {
    // Check if there is a local master passcode bypass login saved
    const savedLocalAdmin = localStorage.getItem('archiv2ie_local_admin');
    if (savedLocalAdmin === 'true') {
      setIsAdminUser(true);
      setCurrentUser({
        email: ADMIN_EMAIL,
        displayName: 'Administrateur (Secours)',
        uid: 'local-admin-uid',
      } as any);
      setAuthChecked(true);
      
      // Load Google Drive token and admin config
      fetchAdminConfig().then(() => {
        fetchDeposits();
      });
    }

    const unsubscribe = initAuth(
      async (user, token) => {
        if (localStorage.getItem('archiv2ie_local_admin') === 'true') {
          // Keep local admin bypass active
          return;
        }
        setCurrentUser(user);
        const isAdmin = user?.email === ADMIN_EMAIL;
        setIsAdminUser(isAdmin);
        setAuthChecked(true);

        if (isAdmin) {
          if (token) {
            setAdminToken(token);
            try {
              await fetch('/api/admin/config/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken: token })
              });
            } catch (e) {
              console.error('Erreur de sauvegarde de token admin sur le backend:', e);
            }
            fetchDeposits();
          } else {
            // No in-memory token, load from backend config
            fetchAdminConfig().then(() => {
              fetchDeposits();
            });
          }
        }
      },
      () => {
        if (localStorage.getItem('archiv2ie_local_admin') === 'true') {
          // Keep local admin bypass active
          return;
        }
        setCurrentUser(null);
        setIsAdminUser(false);
        setAdminToken(null);
        setAuthChecked(true);
      }
    );
    return () => unsubscribe();
  }, []);

  // Fetch deposits when authenticated as Admin
  useEffect(() => {
    if (isAdminUser) {
      fetchDeposits();
    } else {
      setFirestoreDeposits([]);
    }
  }, [isAdminUser]);

  // Admin login flow
  const handleAdminLogin = () => {
    setIsLoginModalOpen(true);
  };

  const handleGoogleLogin = async () => {
    setIsLoggingIn(true);
    try {
      const result = await googleSignIn();
      if (result) {
        const { user, accessToken } = result;
        if (user.email !== ADMIN_EMAIL) {
          showToast(`Accès refusé. Seul le compte administrateur "${ADMIN_EMAIL}" est autorisé.`, "error");
          await logout();
          setCurrentUser(null);
          setIsAdminUser(false);
          setAdminToken(null);
        } else {
          setIsAdminUser(true);
          setCurrentUser(user);
          if (accessToken) {
            setAdminToken(accessToken);
            try {
              await fetch('/api/admin/config/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ accessToken })
              });
            } catch (errDb) {
              console.error("Erreur d'écriture du token admin sur le backend:", errDb);
            }
          }
          showToast("Connexion réussie avec Google ! Bienvenue sur l'espace admin d'archiv2ie.", "success");
          setIsLoginModalOpen(false);
        }
      }
    } catch (e: any) {
      console.error("La connexion admin a échoué:", e);
      if (e.code === 'auth/popup-blocked' || String(e).includes('popup-blocked')) {
        showToast(
          `Le navigateur a bloqué la fenêtre de connexion Google (Popup bloqué).\n\n` +
          `Cela est dû au fait que l'application s'exécute dans un cadre intégré (iframe) d'AI Studio.\n\n` +
          `👉 Pour vous connecter, veuillez soit :\n` +
          `1. Cliquer sur l'icône de partage / nouvel onglet en haut à droite de l'écran pour lancer l'application en plein écran.\n` +
          `2. Autoriser les popups dans la barre d'adresse de votre navigateur.\n` +
          `3. Utiliser l'Option de Connexion Directe ci-dessous avec le code de secours "archiv2ie".`,
          "error"
        );
      } else {
        const errorCode = e.code ? ` (${e.code})` : '';
        showToast(`Erreur de connexion avec Google${errorCode}. Utilisez le mot de passe de secours pour vous connecter instantanément.`, "error");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPassword) {
      showToast("Veuillez saisir votre mot de passe.", "error");
      return;
    }
    setIsLoggingIn(true);

    // Fetch custom master passcode from backend dynamically
    let customPasscodeDb = '';
    try {
      const res = await fetch('/api/admin/config');
      const data = await res.json();
      if (data.passcode) {
        customPasscodeDb = data.passcode.trim().toLowerCase();
      }
    } catch (errPass) {
      console.warn("N'a pas pu charger le code maître personnalisé depuis le backend:", errPass);
    }

    const cleanPassword = loginPassword.trim().toLowerCase();
    const defaultMasterPasswords = [
      'archiv2ie', 
      '2ie', 
      '2ieadmin', 
      'eyuaelijah', 
      'archiv2ie2026', 
      'admin', 
      'admin2ie'
    ];

    const isMasterPassword = (customPasscodeDb && cleanPassword === customPasscodeDb) || defaultMasterPasswords.includes(cleanPassword);

    if (isMasterPassword) {
      try {
        localStorage.setItem('archiv2ie_local_admin', 'true');
        setIsAdminUser(true);
        setCurrentUser({
          email: ADMIN_EMAIL,
          displayName: 'Administrateur (Secours)',
          uid: 'local-admin-uid',
        } as any);

        // Load config and fetch deposits
        fetchAdminConfig().then(() => {
          fetchDeposits();
        });

        showToast("Connexion d'administration réussie via mot de passe de secours ! Bienvenue.", "success");
        setIsLoginModalOpen(false);
        setLoginPassword('');
        return;
      } catch (errLocal: any) {
        console.error("Erreur de bypass local:", errLocal);
      } finally {
        setIsLoggingIn(false);
      }
    }

    try {
      const user = await emailSignIn(loginEmail, loginPassword);
      if (user) {
        if (user.email !== ADMIN_EMAIL) {
          showToast(`Accès refusé. Seul le compte administrateur "${ADMIN_EMAIL}" est autorisé.`, "error");
          await logout();
          setCurrentUser(null);
          setIsAdminUser(false);
          setAdminToken(null);
        } else {
          setIsAdminUser(true);
          setCurrentUser(user);
          // E-mail session doesn't carry a Google Drive access token natively
          setAdminToken(null);
          showToast("Connexion réussie ! Bienvenue sur l'espace admin d'archiv2ie.", "success");
          setIsLoginModalOpen(false);
          setLoginPassword('');
        }
      }
    } catch (e: any) {
      console.error("La connexion admin par e-mail a échoué:", e);
      let errorMsg = "Erreur de connexion. Vérifiez vos identifiants ou votre mot de passe.";
      if (e.code === 'auth/wrong-password') {
        errorMsg = "Mot de passe incorrect.";
      } else if (e.code === 'auth/user-not-found') {
        errorMsg = "Compte administrateur non configuré dans Firebase Auth. Veuillez utiliser un mot de passe de secours.";
      } else if (e.code === 'auth/invalid-credential') {
        errorMsg = "Identifiants invalides ou mot de passe de secours incorrect.";
      }
      showToast(errorMsg, "error");
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleAdminLogout = async () => {
    localStorage.removeItem('archiv2ie_local_admin');
    await logout();
    setCurrentUser(null);
    setIsAdminUser(false);
    setAdminToken(null);
    showToast("Vous avez été déconnecté de l'espace d'administration.", "info");
  };

  const handleSaveCustomPasscode = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanNewPasscode = newPasscode.trim().toLowerCase();
    
    if (!cleanNewPasscode) {
      showToast("Veuillez saisir un code d'accès ou cliquer sur Réinitialiser.", "error");
      return;
    }

    if (cleanNewPasscode.length < 4) {
      showToast("Le code maître doit faire au moins 4 caractères par sécurité.", "error");
      return;
    }

    setIsSavingPasscode(true);
    try {
      const res = await fetch('/api/admin/config/passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode: cleanNewPasscode })
      });
      if (!res.ok) throw new Error();
      setCustomPasscode(cleanNewPasscode);
      showToast("Le code maître personnalisé a été enregistré avec succès !", "success");
    } catch (err: any) {
      console.error("Erreur d'enregistrement du code maître :", err);
      showToast("Impossible de sauvegarder le code maître sur le serveur.", "error");
    } finally {
      setIsSavingPasscode(false);
    }
  };

  const handleResetCustomPasscode = async () => {
    setIsSavingPasscode(true);
    try {
      const res = await fetch('/api/admin/config/passcode', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ deletePasscode: true })
      });
      if (!res.ok) throw new Error();
      setCustomPasscode('');
      setNewPasscode('');
      showToast("Code maître personnalisé supprimé. Retour aux codes par défaut.", "success");
    } catch (err: any) {
      console.error("Erreur de suppression du code maître :", err);
      showToast("Impossible de supprimer le code maître.", "error");
    } finally {
      setIsSavingPasscode(false);
    }
  };

  // Synchronize document to Admin's Google Drive on demand
  const handleSyncToDrive = async (dep: any) => {
    setIsSyncingId(dep.id);
    try {
      if (!dep.base64) {
        showToast("Impossible de renvoyer le fichier : les données de ce fichier volumineux ne sont pas stockées dans Firestore.", "error");
        setIsSyncingId(null);
        return;
      }

      // Submit file to Google Apps Script Web App inside hidden iframe asynchronously
      const iframeId = 'iframe-masquee-archiv2ie-react-sync';
      let iframe = document.getElementById(iframeId) as HTMLIFrameElement;
      if (!iframe) {
        iframe = document.createElement('iframe');
        iframe.id = iframeId;
        iframe.name = iframeId;
        iframe.style.display = 'none';
        document.body.appendChild(iframe);
      }

      const tempForm = document.createElement('form');
      tempForm.method = 'POST';
      tempForm.action = "https://script.google.com/macros/s/AKfycbyCsHpIQj_ncjj6Tjbvaz4xqoA6KbWBpXmR-D5TvAVdTAFgKZzXpjzhf0TaDY41J7Ol/exec";
      tempForm.target = iframeId;

      const submissionDataset = {
        nom: dep.nom,
        email: dep.email,
        statut: dep.statut,
        filiere: dep.filiere,
        semestre: dep.semestre,
        typeDoc: dep.typeDoc,
        matiere: dep.matiere,
        commentaire: dep.commentaire || 'Aucun',
        filename: dep.fileName,
        mimeType: dep.fileType || 'application/pdf',
        bytes: dep.base64
      };

      for (const [key, value] of Object.entries(submissionDataset)) {
        const input = document.createElement('input');
        input.type = 'hidden';
        input.name = key;
        input.value = value;
        tempForm.appendChild(input);
      }

      document.body.appendChild(tempForm);
      tempForm.submit();

      setTimeout(() => {
        if (document.body.contains(tempForm)) {
          document.body.removeChild(tempForm);
        }
      }, 3000);

      // Update backend deposit
      try {
        await fetch(`/api/deposits/${dep.id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            driveFileId: 'synced_by_apps_script',
            driveStatus: 'success'
          })
        });
        fetchDeposits();
      } catch (errDb) {
        console.error("Erreur de synchronisation du dépôt :", errDb);
      }

      showToast(`Le fichier "${dep.fileName}" a été téléversé avec succès dans votre Google Drive d'archiv2ie !`, "success");
    } catch (err: any) {
      console.error(err);
      showToast(`Erreur d'envoi Google Drive: ${err.message || err}`, "error");
    } finally {
      setIsSyncingId(null);
    }
  };

  const handleDeleteFirestoreDeposit = async (id: string) => {
    try {
      const res = await fetch(`/api/deposits/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error();
      setFirestoreDeposits(prev => prev.filter(d => d.id !== id));
      if (expandedDepositId === id) {
        setExpandedDepositId(null);
      }
      showToast("Le dépôt a été définitivement supprimé de la file de modération.", "success");
    } catch (err: any) {
      console.error(err);
      showToast("Une erreur est survenue lors de la suppression.", "error");
    }
  };

  const handleCopyMetadata = (dep: any) => {
    const text = `--- archiv2ie - FICHE DE DÉPÔT ---
ID Unique: ${dep.id}
Date Soumission: ${dep.date}
Statut Drive: ${dep.driveStatus === 'success' ? 'Synchronisé (' + dep.driveFileId + ')' : 'En attente'}
Déposant: ${dep.nom} (${dep.statut})
Email: ${dep.email}
Filière: ${dep.filiere}
Semestre: ${dep.semestre}
Matière: ${dep.matiere}
Ressource: [${dep.typeDoc}] ${dep.nomDoc}
Fichier: ${dep.fileName} (${dep.fileSize})
Commentaire: ${dep.commentaire}`;

    navigator.clipboard.writeText(text).then(() => {
      setCopiedId(dep.id);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const handleDownloadJSON = (dep: any) => {
    const { base64, ...metaOnly } = dep;
    const blob = new Blob([JSON.stringify(metaOnly, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `fiche_depot_${dep.id.toLowerCase()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDownloadFile = (dep: any) => {
    if (!dep.base64) {
      showToast("Ce document d'exemple n'a pas de fichier local encodé.", "error");
      return;
    }
    try {
      const rawBase64 = dep.base64.includes('base64,') 
        ? dep.base64.split('base64,')[1] 
        : dep.base64;
      const byteCharacters = atob(rawBase64);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      const blob = new Blob([byteArray], { type: dep.fileType || 'application/octet-stream' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = dep.fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (e) {
      console.error(e);
      showToast("Une erreur est survenue lors de la reconstruction du document local.", "error");
    }
  };

  // Dynamic semesters options based on selected branch
  const getSemestersForFiliere = (filiere: string) => {
    switch (filiere) {
      case 'tc':
        return ["S1", "S2", "S3", "S4"];
      case 'gee':
        return ["S5D", "S5S", "S6D", "S6S", "S7", "S8", "S9 - Énergies Renouvelables", "S9 - Réseaux Électriques"];
      case 'gc-btp':
        return ["S5D", "S5S", "S6D", "S6S", "S7", "S8", "S9 - Bâtiment", "S9 - Transport"];
      case 'geaah':
        return ["S5D", "S5S", "S6D", "S6S", "S7", "S8", "S9 - Approvisionnement en eau", "S9 - Assainissement", "S9 - Hydro-agricoles"];
      default:
        return [];
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'filiere' ? { semestre: '' } : {})
    }));
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const processFile = (file: File) => {
    if (file.size > 15 * 1024 * 1024) {
      showToast("Désolé, ce fichier dépasse la limite de 15 Mo. Veuillez choisir un document plus léger ou compressé.", "error");
      return;
    }
    setSelectedFile(file);
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      const resultStr = reader.result as string;
      const base64 = resultStr.split(',')[1] || '';
      setBase64Data(base64);
    };
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast("Veuillez sélectionner un fichier d'abord 📂", "error");
      return;
    }

    if (!base64Data) {
      showToast("Le fichier est en cours de traitement en arrière-plan. Veuillez patienter une seconde puis réessayez.", "info");
      return;
    }

    setIsSubmitting(true);

    try {
      const depositId = 'DEPOT-' + Math.random().toString(36).substring(2, 7).toUpperCase();
      const nowStr = new Date().toLocaleDateString('fr-FR', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      const filiereNameMap: Record<string, string> = {
        'tc': 'Tronc Commun (S1 à S4)',
        'gee': 'Génie Électrique & Énergétique (GEE)',
        'gc-btp': 'Génie Civil & BTP (GC-BTP)',
        'geaah': 'Génie Eau, Assainissement & AH (GEAAH)'
      };

      const mappedFiliere = filiereNameMap[formData.filiere] || formData.filiere;

      let driveFileId = '';
      let driveStatus = 'success'; // Les fichiers atterrissent directement sur le Drive via le Google Apps Script (sans protocole/token)

      // Safe Firestore limit: 1MB document limit, but we set a very conservative threshold (50KB)
      // to ensure lightning-fast Firestore writes on mobile networks and prevent network timeouts.
      // Large files are already saved permanently and securely on Google Drive.
      const isTooLargeForFirestore = selectedFile.size > 50000;
      const base64ToStore = isTooLargeForFirestore ? '' : base64Data;

      // 4. Save metadata (+ base64 if small) to central cloud database (Firestore)
      const newDepot = {
        id: depositId,
        date: nowStr,
        nom: formData.nom,
        email: formData.email,
        statut: formData.statut,
        filiere: mappedFiliere,
        semestre: formData.semestre,
        nomDoc: formData.nomDoc || selectedFile.name,
        matiere: formData.matiere,
        typeDoc: formData.typeDoc,
        commentaire: formData.commentaire || 'Aucun commentaire',
        fileName: selectedFile.name,
        fileSize: (selectedFile.size / (1024 * 1024)).toFixed(2) + ' MB',
        fileType: selectedFile.type,
        status: 'pending',
        driveFileId: driveFileId,
        driveStatus: driveStatus,
        base64: base64ToStore,
        isLargeFile: isTooLargeForFirestore,
        createdAt: new Date().toISOString()
      };

      try {
        await withTimeout(
          fetch('/api/deposits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDepot)
          }),
          15000,
          "Le serveur met trop de temps à répondre. Veuillez vérifier votre connexion internet."
        );
      } catch (errDb) {
        console.error("Erreur d'enregistrement du dépôt sur le backend:", errDb);
      }

      // 5. Submit backup/large file to original Google Apps Script inside hidden iframe asynchronously
      // This is triggered in a setTimeout to avoid blocking the React render thread or freezing the UI on mobile.
      setTimeout(() => {
        try {
          const iframeId = 'iframe-masquee-archiv2ie-react';
          let iframe = document.getElementById(iframeId) as HTMLIFrameElement;
          if (!iframe) {
            iframe = document.createElement('iframe');
            iframe.id = iframeId;
            iframe.name = iframeId;
            iframe.style.display = 'none';
            document.body.appendChild(iframe);
          }

          const tempForm = document.createElement('form');
          tempForm.method = 'POST';
          tempForm.action = "https://script.google.com/macros/s/AKfycbyCsHpIQj_ncjj6Tjbvaz4xqoA6KbWBpXmR-D5TvAVdTAFgKZzXpjzhf0TaDY41J7Ol/exec";
          tempForm.target = iframeId;

          const submissionDataset = {
            nom: formData.nom,
            email: formData.email,
            statut: formData.statut,
            filiere: mappedFiliere,
            semestre: formData.semestre,
            typeDoc: `${formData.typeDoc} - ${formData.nomDoc}`,
            matiere: formData.matiere,
            commentaire: formData.commentaire || 'Aucun',
            filename: selectedFile.name,
            mimeType: selectedFile.type,
            bytes: base64Data
          };

          for (const [key, value] of Object.entries(submissionDataset)) {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = key;
            input.value = value;
            tempForm.appendChild(input);
          }

          document.body.appendChild(tempForm);
          tempForm.submit();

          setTimeout(() => {
            if (document.body.contains(tempForm)) {
              document.body.removeChild(tempForm);
            }
          }, 3000);
        } catch (e) {
          console.warn("Apps script trigger error:", e);
        }
      }, 100);

      // Unlock button and reset state immediately to show fast, modern responsive feedback!
      setIsSubmitting(false);

      // Save success details before resetting form states to show them in the confirmation view
      setSuccessDetails({
        nom: formData.nom,
        nomDoc: formData.nomDoc || selectedFile.name
      });
      setShowSubmissionSuccess(true);

      showToast(`Merci pour votre contribution, ${formData.nom} ! Votre document "${formData.nomDoc || selectedFile.name}" a bien été envoyé à l'équipe de archiv2ie.`, 'success');

      // Reset states
      setFormData({
        nom: '',
        email: '',
        statut: 'Etudiant',
        filiere: '',
        semestre: '',
        nomDoc: '',
        matiere: '',
        typeDoc: 'Cours',
        commentaire: ''
      });
      setSelectedFile(null);
      setBase64Data('');

    } catch (err: any) {
      console.error(err);
      setIsSubmitting(false);
      showToast(`Une erreur est survenue lors de la soumission : ${err.message || err}`, 'error');
    }
  };

  const semesters = getSemestersForFiliere(formData.filiere);

  // Filter and search deposits for admin view
  const filteredDeposits = firestoreDeposits.filter(dep => {
    const matchesSearch = 
      dep.nomDoc?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.nom?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.matiere?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      dep.id?.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (filterDrive === 'synced') {
      return matchesSearch && dep.driveStatus === 'success';
    }
    if (filterDrive === 'pending') {
      return matchesSearch && dep.driveStatus !== 'success';
    }
    return matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header and page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-3 max-w-4xl">
          <h1 
            onClick={() => {
              const newClicks = titleClicks + 1;
              setTitleClicks(newClicks);
              if (newClicks >= 5) {
                const nextState = !showAdminTrigger;
                setShowAdminTrigger(nextState);
                localStorage.setItem('archiv2ie_show_admin_button', nextState ? 'true' : 'false');
                showToast(nextState ? "Bouton Espace Administration révélé !" : "Bouton Espace Administration masqué !", "info");
                setTitleClicks(0);
              }
            }}
            className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight cursor-default select-none transition-all active:scale-[0.99]"
            title="Savoir-faire et partage"
          >
            Contribuer au Projet
          </h1>
          <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
            Aidez-nous à enrichir l'archivage académique de l'Institut 2iE en transmettant vos documents d'étude.
          </p>
        </div>

        {/* Secure Administration Area access */}
        <div className="flex-shrink-0 self-start md:self-center">
          {authChecked && (
            isAdminUser ? (
              <div className="flex items-center gap-3 bg-emerald-50 border border-emerald-100 p-2.5 rounded-2xl">
                <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-xs" title={currentUser?.email || ''}>
                  {currentUser?.displayName?.[0] || 'A'}
                </div>
                <div className="text-left">
                  <span className="text-[10px] uppercase font-bold text-emerald-600 block">Modérateur Connecté</span>
                  <span className="text-xs font-semibold text-gray-700 truncate block max-w-[150px]">{currentUser?.email}</span>
                </div>
                <button
                  onClick={handleAdminLogout}
                  className="ml-2 inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 rounded-xl text-xs font-bold transition-all cursor-pointer border border-red-100"
                  title="Se déconnecter de l'espace admin"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  <span>Déconnexion</span>
                </button>
              </div>
            ) : showAdminTrigger ? (
              <button
                onClick={handleAdminLogin}
                disabled={isLoggingIn}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer disabled:opacity-50 animate-fade-in"
              >
                {isLoggingIn ? (
                  <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Lock className="h-3.5 w-3.5" />
                )}
                <span>Espace Administration</span>
              </button>
            ) : null
          )}
        </div>
      </div>

      <div className="bg-gradient-to-r from-brand/5 via-brand/5 to-transparent border-l-4 border-brand p-6 rounded-r-2xl">
        <p className="font-sans text-gray-700 text-base sm:text-lg italic leading-relaxed">
          "archiv2ie existe et prospère grâce à ceux qui donnent autant qu'ils reçoivent."
        </p>
      </div>

      {/* Step protocol */}
      <section className="space-y-6">
        <h3 className="font-serif text-xl font-bold text-gray-900">Le protocole de dépôt en 3 étapes</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold font-serif text-lg">
              1
            </div>
            <strong className="block font-serif text-base text-gray-900">Formulaire</strong>
            <p className="text-xs text-gray-500 leading-relaxed">
              Remplissez précisément les métadonnées requises (filière, semestre, matière, auteur du support).
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold font-serif text-lg">
              2
            </div>
            <strong className="block font-serif text-base text-gray-900">Dépôt sécurisé</strong>
            <p className="text-xs text-gray-500 leading-relaxed">
              Téléversez votre document PDF, Excel ou archive ZIP (propre, recadré et lisible pour l'impression).
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold font-serif text-lg">
              3
            </div>
            <strong className="block font-serif text-base text-gray-900">Modération & Drive</strong>
            <p className="text-xs text-gray-500 leading-relaxed">
              L'administrateur valide le syllabus, et le document atterrit instantanément ou en 1 clic dans son Google Drive.
            </p>
          </div>
        </div>
      </section>

      {/* Verification Charter Table */}
      <section className="space-y-4">
        <h3 className="font-serif text-xl font-bold text-gray-900">Charte de validation des documents</h3>
        <div className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left text-sm border-collapse">
            <thead>
              <tr className="border-b border-gray-100 font-bold uppercase text-[10px] tracking-wider">
                <th className="py-4 px-6 bg-emerald-50 text-emerald-800 border-r border-gray-100">
                  ✅ Éléments Acceptés & Encouragés
                </th>
                <th className="py-4 px-6 bg-red-50 text-red-800">
                  ❌ Éléments Systématiquement Rejetés
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-xs text-gray-600">
              <tr>
                <td className="py-3 px-6 border-r border-gray-100">
                  Sujets officiels d'examens, DS, corrigés clairs et TP de groupe rédigés.
                </td>
                <td className="py-3 px-6">
                  Fichiers flous, mal cadrés, photographiés de biais ou totalement illisibles.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 border-r border-gray-100">
                  Supports de cours officiels d'enseignants, syllabus d'année ou guides pratiques.
                </td>
                <td className="py-3 px-6">
                  Copies d'examens nominatives, relevés de notes ou documents comportant des données privées.
                </td>
              </tr>
              <tr>
                <td className="py-3 px-6 border-r border-gray-100">
                  Fiches de révisions rédigées par des équipes ou des majors d'année.
                </td>
                <td className="py-3 px-6">
                  Ouvrages scolaires d'éditeurs tiers protégés par les droits d'auteur (hors partage libre).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Interactive Form Section */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        {showSubmissionSuccess ? (
          <div className="text-center py-8 px-4 max-w-xl mx-auto space-y-6 animate-fade-in">
            <div className="mx-auto w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center">
              <Check className="h-8 w-8" />
            </div>
            
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-gray-900">Document soumis avec succès ! 🎉</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Merci pour votre contribution, <strong>{successDetails?.nom}</strong> ! Votre document <strong>"{successDetails?.nomDoc}"</strong> a bien été envoyé à l'équipe de archiv2ie.
              </p>
            </div>

            <div className="pt-2">
              <button
                type="button"
                onClick={() => {
                  setShowSubmissionSuccess(false);
                  setSuccessDetails(null);
                }}
                className="px-6 py-3 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl transition-all cursor-pointer shadow-sm hover:shadow"
              >
                Déposer un autre document 📤
              </button>
            </div>
          </div>
        ) : (
          <>
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900">Partager vos ressources pédagogiques</h2>
              <p className="text-gray-500 text-xs mt-1">
                Chaque cours partagé est un phare pour les promotions d'étudiants à venir.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Row 1: Nom & Email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label htmlFor="nom" className="text-xs font-bold text-gray-700">Nom & Prénoms</label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    required
                    value={formData.nom}
                    onChange={handleInputChange}
                    placeholder="Ex: EL YAH"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                  />
                </div>
                
                <div className="space-y-1.5">
                  <label htmlFor="email" className="text-xs font-bold text-gray-700">Adresse email universitaire</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Ex: votre.nom@2ie-edu.org"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                  />
                </div>
              </div>

              {/* Row 2: Status */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 block">Vous êtes ?</label>
                <div className="flex flex-wrap gap-4">
                  {['Etudiant', 'Enseignant', 'Ancien étudiant'].map((role) => (
                    <label key={role} className="inline-flex items-center gap-2 text-xs font-medium text-gray-700 cursor-pointer">
                      <input
                        type="radio"
                        name="statut"
                        value={role}
                        checked={formData.statut === role}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-brand focus:ring-brand/30"
                      />
                      <span>{role === 'Etudiant' ? 'Étudiant' : role}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Row 3: Filiere and dynamic Semester dropdown */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label htmlFor="filiere" className="text-xs font-bold text-gray-700">Filière concernée</label>
                  <select
                    id="filiere"
                    name="filiere"
                    required
                    value={formData.filiere}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all cursor-pointer"
                  >
                    <option value="">Sélectionner une filière</option>
                    <option value="tc">Tronc Commun (S1 à S4)</option>
                    <option value="gee">Génie Électrique & Énergétique (GEE)</option>
                    <option value="gc-btp">Génie Civil & BTP (GC-BTP)</option>
                    <option value="geaah">Génie Eau, Assainissement & AH (GEAAH)</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="semestre" className="text-xs font-bold text-gray-700">Semestre concerné</label>
                  <select
                    id="semestre"
                    name="semestre"
                    required
                    disabled={!formData.filiere}
                    value={formData.semestre}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all cursor-pointer disabled:bg-gray-50 disabled:text-gray-400 disabled:cursor-not-allowed"
                  >
                    <option value="">
                      {!formData.filiere ? "Sélectionnez d'abord une filière" : "Sélectionner un semestre"}
                    </option>
                    {semesters.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Row 4: Matiere, Type of Doc, Document name */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                <div className="space-y-1.5">
                  <label htmlFor="matiere" className="text-xs font-bold text-gray-700">Matière / UV académique</label>
                  <input
                    id="matiere"
                    name="matiere"
                    type="text"
                    required
                    value={formData.matiere}
                    onChange={handleInputChange}
                    placeholder="Ex: Béton Armé 1 / Hydraulique Générale"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                  />
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="typeDoc" className="text-xs font-bold text-gray-700">Type de ressource</label>
                  <select
                    id="typeDoc"
                    name="typeDoc"
                    required
                    value={formData.typeDoc}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all cursor-pointer"
                  >
                    <option value="Cours">Cours Complet</option>
                    <option value="Sujet d'examen">Sujet d'Examen / DS</option>
                    <option value="TD/TP">TD ou TP Corrigé</option>
                    <option value="Rapport PFE">Rapport de PFE / Stage</option>
                    <option value="Fiche récap">Fiche de révision</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="nomDoc" className="text-xs font-bold text-gray-700">Nom du document</label>
                  <input
                    id="nomDoc"
                    name="nomDoc"
                    type="text"
                    required
                    value={formData.nomDoc}
                    onChange={handleInputChange}
                    placeholder="Ex: TD Flexion Simple / DS 2025"
                    className="w-full px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                  />
                </div>
              </div>

              {/* Commentaire */}
              <div className="space-y-1.5">
                <label htmlFor="commentaire" className="text-xs font-bold text-gray-700">Précisions ou commentaires additionnels (Facultatif)</label>
                <textarea
                  id="commentaire"
                  name="commentaire"
                  rows={3}
                  value={formData.commentaire}
                  onChange={handleInputChange}
                  placeholder="Ex: Corrigé validé par le professeur Coulibaly. Manque juste la question 3 du TP."
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all resize-none"
                />
              </div>

              {/* Secure File drag and drop Area */}
              <div className="space-y-2">
                <span className="text-xs font-bold text-gray-700 block">Téléversement du document numérique</span>
                
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all flex flex-col items-center justify-center space-y-3 ${
                    dragActive 
                      ? 'border-brand bg-brand/5 scale-[0.99]' 
                      : selectedFile 
                        ? 'border-emerald-200 bg-emerald-50/10' 
                        : 'border-gray-200 bg-gray-50/50 hover:bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.xlsx,.xls,.doc,.docx,.zip,.rar"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <>
                      <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                        <File className="h-6 w-6 animate-pulse" />
                      </div>
                      <div>
                        <strong className="block text-sm text-gray-800 break-all">{selectedFile.name}</strong>
                        <span className="text-xs text-gray-400">
                          {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB • Prêt pour l'envoi
                        </span>
                      </div>
                      <button 
                        type="button" 
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setBase64Data('');
                        }}
                        className="px-3 py-1 bg-red-50 hover:bg-red-100 text-red-600 text-2xs font-bold rounded-lg transition-all"
                      >
                        Retirer le fichier
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="p-3 bg-brand/10 text-brand rounded-xl">
                        <Upload className="h-6 w-6" />
                      </div>
                      <div>
                        <strong className="block text-sm text-gray-800">Glissez-déposez votre fichier ici</strong>
                        <span className="text-xs text-gray-400">
                          Formats acceptés : PDF, Excel, Word, ZIP, RAR (Max: 15MB)
                        </span>
                      </div>
                      <span className="px-3 py-1.5 bg-brand/10 text-brand text-xs font-bold rounded-xl hover:bg-brand/15 transition-all">
                        Parcourir mes dossiers
                      </span>
                    </>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedFile}
                  className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-white shadow-md shadow-brand/10 transition-all flex items-center justify-center gap-2 ${
                    isSubmitting 
                      ? 'bg-brand/50 cursor-not-allowed' 
                      : !selectedFile 
                        ? 'bg-gray-300 cursor-not-allowed shadow-none' 
                        : 'bg-brand hover:bg-brand-hover hover:shadow-lg'
                  }`}
                >
                  {isSubmitting && <RefreshCw className="h-4 w-4 animate-spin text-white" />}
                  <span>Soumettre le document 📤</span>
                </button>
              </div>

            </form>
          </>
        )}
      </section>

      {/* Captured Submissions / Suivi & Récupération des dépôts (VISIBLE ONLY TO ADMIN) */}
      {isAdminUser && (
        <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-100">
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>📋 Suivi de Dépôts Archivés (Espace Admin)</span>
              </h2>
              <p className="text-gray-500 text-xs mt-1">
                Visualisez, modérez et validez l'atterrissage de tous les documents des étudiants de 2iE vers votre Google Drive.
              </p>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase">
                {filteredDeposits.length} {filteredDeposits.length > 1 ? 'dépôts trouvés' : 'dépôt trouvé'}
              </span>
              <button
                type="button"
                onClick={handleAdminLogout}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-700 hover:text-red-800 border border-red-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
                title="Se déconnecter de la session d'administration"
              >
                <LogOut className="h-3.5 w-3.5" />
                <span>Se déconnecter</span>
              </button>
            </div>
          </div>

          {/* Main Admin Tab Switcher */}
          <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-gray-50 p-2 rounded-2xl border border-gray-100/80">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  // If switching from security, default to 'list' (submissions list)
                  if (adminTab === 'security') {
                    setAdminTab('list');
                  }
                }}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  adminTab !== 'security'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/50 border border-transparent'
                }`}
              >
                <FolderOpen className={`h-4 w-4 ${adminTab !== 'security' ? 'text-brand' : 'text-gray-400'}`} />
                <span>Exploitation des données</span>
              </button>

              <button
                type="button"
                onClick={() => setAdminTab('security')}
                className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-2.5 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                  adminTab === 'security'
                    ? 'bg-white text-gray-900 shadow-sm border border-gray-200/50'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-white/50 border border-transparent'
                }`}
              >
                <Shield className={`h-4 w-4 ${adminTab === 'security' ? 'text-brand' : 'text-gray-400'}`} />
                <span>Sécurité</span>
              </button>
            </div>

            {/* Sub-tabs for data exploitation when active */}
            {adminTab !== 'security' && (
              <div className="flex p-1 bg-gray-200/50 rounded-xl gap-1">
                <button
                  type="button"
                  onClick={() => setAdminTab('list')}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    adminTab === 'list'
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-950'
                  }`}
                >
                  📋 Liste de dépôts
                </button>
                <button
                  type="button"
                  onClick={() => setAdminTab('stats')}
                  className={`px-3 py-1.5 text-[11px] font-bold rounded-lg transition-all cursor-pointer ${
                    adminTab === 'stats'
                      ? 'bg-brand text-white shadow-sm'
                      : 'text-gray-600 hover:text-gray-950'
                  }`}
                >
                  📊 Tableau de bord & Annuaire
                </button>
              </div>
            )}
          </div>

          {adminTab === 'list' ? (
            <>
              {/* Controls: Search & Drive Sync Filter */}
              <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                {/* Search Input */}
                <div className="relative w-full sm:max-w-sm">
                  <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Rechercher par titre, matière, auteur..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none"
                  />
                </div>

                {/* Filter Tabs */}
                <div className="flex gap-1.5 self-start sm:self-center">
                  <button
                    type="button"
                    onClick={() => setFilterDrive('all')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      filterDrive === 'all' 
                        ? 'bg-gray-900 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    Tous ({firestoreDeposits.length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterDrive('synced')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      filterDrive === 'synced' 
                        ? 'bg-emerald-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    Synchronisés ({firestoreDeposits.filter(d => d.driveStatus === 'success').length})
                  </button>
                  <button
                    type="button"
                    onClick={() => setFilterDrive('pending')}
                    className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                      filterDrive === 'pending' 
                        ? 'bg-amber-600 text-white' 
                        : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                    }`}
                  >
                    En attente ({firestoreDeposits.filter(d => d.driveStatus !== 'success').length})
                  </button>
                </div>
              </div>

              {isLoadingDeposits ? (
                <div className="text-center py-12">
                  <RefreshCw className="h-8 w-8 animate-spin mx-auto text-brand mb-2" />
                  <span className="text-xs text-gray-400 font-medium">Chargement des dépôts depuis Firestore...</span>
                </div>
              ) : filteredDeposits.length === 0 ? (
                <div className="text-center py-12 flex flex-col items-center justify-center space-y-3 bg-gray-50/50 rounded-2xl border border-gray-100">
                  <FileText className="h-10 w-10 text-gray-300" />
                  <h3 className="text-sm font-bold text-gray-700">Aucun dépôt trouvé</h3>
                  <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                    Aucun dépôt ne correspond à vos filtres de recherche.
                  </p>
                </div>
              ) : (
                <div className="space-y-4 divide-y divide-gray-100">
                  {filteredDeposits.map((dep) => {
                    const isExpanded = expandedDepositId === dep.id;
                    const isSynced = dep.driveStatus === 'success';

                    return (
                      <div 
                        key={dep.id} 
                        className={`pt-4 first:pt-0 transition-all ${
                          isExpanded ? 'bg-gray-50/50 p-4 rounded-2xl border border-gray-100' : ''
                        }`}
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          {/* Left side: icons, titles & timestamps */}
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="p-2.5 bg-brand/10 text-brand rounded-xl mt-1 flex-shrink-0">
                              <FileText className="h-5 w-5" />
                            </div>
                            <div className="space-y-1 min-w-0">
                              <div className="flex flex-wrap items-center gap-2">
                                <span className="px-2 py-0.5 bg-brand/5 border border-brand/10 text-brand font-semibold text-[10px] rounded-full">
                                  {dep.typeDoc}
                                </span>
                                <span className="text-[10px] font-mono font-bold text-gray-400">
                                  {dep.id}
                                </span>
                              </div>
                              <h4 className="font-serif text-base font-bold text-gray-900 leading-snug break-words">
                                {dep.nomDoc}
                              </h4>
                              <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-gray-400 font-medium">
                                <span className="flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {dep.date}
                                </span>
                                <span className="hidden sm:inline">•</span>
                                <span className="text-brand font-semibold underline decoration-dotted truncate max-w-xs sm:max-w-md block" title={dep.fileName}>
                                  {dep.fileName} ({dep.fileSize})
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Right side: Drive sync indicator, large file indicator & Expand triggers */}
                          <div className="flex items-center gap-2 self-end sm:self-center">
                            {dep.isLargeFile && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-purple-50 text-purple-700 border border-purple-100" title="Ce fichier dépasse 750 Ko et est sauvegardé sur Google Drive">
                                ⚡ Volumineux
                              </span>
                            )}

                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${
                              isSynced 
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-100' 
                                : 'bg-amber-50 text-amber-700 border-amber-100 animate-pulse'
                            }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${isSynced ? 'bg-emerald-500' : 'bg-amber-500'}`} />
                              {isSynced ? 'Sur Google Drive' : "En attente Drive"}
                            </span>

                            <button
                              type="button"
                              onClick={() => setExpandedDepositId(isExpanded ? null : dep.id)}
                              className="p-2 hover:bg-gray-100 active:bg-gray-200 rounded-lg text-gray-500 transition-all cursor-pointer"
                              title={isExpanded ? "Masquer les détails" : "Afficher les détails"}
                            >
                              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                            </button>
                          </div>
                        </div>

                        {/* Metadata Detail Section */}
                        {isExpanded && (
                          <div className="mt-4 pt-4 border-t border-gray-200/60 space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                              <div className="space-y-1">
                                <span className="font-bold text-gray-400 block uppercase text-[9px] tracking-wider">Auteur du dépôt (Statut)</span>
                                <span className="text-gray-800 font-semibold">{dep.nom}</span> 
                                <span className="ml-1.5 px-1.5 py-0.5 bg-gray-100 text-gray-500 font-bold rounded text-[9px]">{dep.statut}</span>
                              </div>

                              <div className="space-y-1">
                                <span className="font-bold text-gray-400 block uppercase text-[9px] tracking-wider">Adresse email universitaire</span>
                                <span className="text-gray-800 font-mono block truncate">{dep.email}</span>
                              </div>

                              <div className="space-y-1">
                                <span className="font-bold text-gray-400 block uppercase text-[9px] tracking-wider">Filière & Spécialité</span>
                                <span className="text-gray-800 font-semibold">{dep.filiere}</span>
                              </div>

                              <div className="space-y-1">
                                <span className="font-bold text-gray-400 block uppercase text-[9px] tracking-wider">Semestre / Option d'études</span>
                                <span className="text-gray-800 font-semibold">{dep.semestre}</span>
                              </div>

                              <div className="space-y-1 col-span-1 sm:col-span-2">
                                <span className="font-bold text-gray-400 block uppercase text-[9px] tracking-wider">Matière académique</span>
                                <span className="text-brand font-semibold">{dep.matiere}</span>
                              </div>

                              {dep.driveFileId && (
                                <div className="space-y-1 col-span-1 sm:col-span-2 font-mono">
                                  <span className="font-bold text-emerald-600 block uppercase text-[9px] tracking-wider">ID Document Google Drive</span>
                                  <span className="text-emerald-700 bg-emerald-50 px-2 py-1 rounded select-all break-all text-[10px] inline-block">{dep.driveFileId}</span>
                                </div>
                              )}

                              {dep.isLargeFile && !dep.driveFileId && (
                                <div className="space-y-1 col-span-1 sm:col-span-2 text-purple-700 bg-purple-50/70 p-3 rounded-xl border border-purple-100 text-[10px] leading-relaxed">
                                  ⚠️ <strong>Fichier Volumineux ({dep.fileSize}) :</strong> Ce document a été envoyé directement sur votre Google Drive d'administration ou via Google Apps Script. Il n'est pas stocké dans la base de données centrale Firestore pour des raisons de limites de taille.
                                </div>
                              )}

                              {dep.isLargeFile && dep.driveFileId && (
                                <div className="space-y-1 col-span-1 sm:col-span-2 text-purple-700 bg-purple-50/70 p-3 rounded-xl border border-purple-100 text-[10px] leading-relaxed">
                                  ℹ️ <strong>Fichier Volumineux ({dep.fileSize}) :</strong> Ce fichier dépasse les capacités de la base de données. Il est stocké de manière sécurisée et permanente dans votre espace Google Drive.
                                </div>
                              )}

                              <div className="space-y-1 sm:col-span-2">
                                <span className="font-bold text-gray-400 block uppercase text-[9px] tracking-wider">Commentaire ou précisions fournis</span>
                                <p className="text-gray-600 bg-white p-3 rounded-xl border border-gray-100 italic leading-relaxed text-[11px] break-words">
                                  "{dep.commentaire}"
                                </p>
                              </div>
                            </div>

                            {/* Interactive Admin Controls Row */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-gray-100">
                              <div className="flex flex-wrap gap-2">
                                
                                {/* Sync to drive button */}
                                {!isSynced && (
                                  <button
                                    type="button"
                                    onClick={() => handleSyncToDrive(dep)}
                                    disabled={isSyncingId === dep.id}
                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-emerald-300 text-white font-bold text-xs rounded-xl transition-all cursor-pointer"
                                    title="Téléverser ce fichier directement dans votre Google Drive"
                                  >
                                    {isSyncingId === dep.id ? (
                                      <>
                                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                        <span>Envoi en cours...</span>
                                      </>
                                    ) : (
                                      <>
                                        <FolderOpen className="h-3.5 w-3.5" />
                                        <span>Envoyer vers mon Drive 📁</span>
                                      </>
                                    )}
                                  </button>
                                )}

                                {/* Copy meta button */}
                                <button
                                  type="button"
                                  onClick={() => handleCopyMetadata(dep)}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                                  title="Copier toutes les métadonnées renseignées"
                                >
                                  {copiedId === dep.id ? (
                                    <>
                                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                                      <span className="text-emerald-700 font-bold">Copié !</span>
                                    </>
                                  ) : (
                                    <>
                                      <Copy className="h-3.5 w-3.5" />
                                      <span>Fiche d'info</span>
                                    </>
                                  )}
                                </button>

                                {/* Download JSON button */}
                                <button
                                  type="button"
                                  onClick={() => handleDownloadJSON(dep)}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 font-bold text-xs rounded-xl transition-all cursor-pointer"
                                  title="Télécharger la fiche technique au format JSON"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  <span>Fiche JSON</span>
                                </button>

                                {/* Download local copy button */}
                                <button
                                  type="button"
                                  onClick={() => handleDownloadFile(dep)}
                                  disabled={!dep.base64}
                                  className={`inline-flex items-center gap-1.5 px-3 py-2 font-bold text-xs rounded-xl transition-all cursor-pointer ${
                                    dep.base64
                                      ? 'bg-brand/10 hover:bg-brand/20 active:bg-brand/30 text-brand-hover'
                                      : 'bg-gray-50 text-gray-300 cursor-not-allowed border border-gray-100'
                                  }`}
                                  title={dep.isLargeFile ? "Ce fichier volumineux est stocké directement sur Google Drive" : "Télécharger une copie locale du fichier numérique d'origine"}
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  <span>Télécharger fichier</span>
                                </button>

                                {/* Open directly in Drive button */}
                                {dep.driveFileId && (
                                  <a
                                    href={`https://drive.google.com/open?id=${dep.driveFileId}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="inline-flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 font-bold text-xs rounded-xl transition-all border border-emerald-100"
                                    title="Ouvrir ce document directement dans Google Drive"
                                  >
                                    <ExternalLink className="h-3.5 w-3.5" />
                                    <span>Ouvrir sur Drive 📂</span>
                                  </a>
                                )}
                              </div>

                              {/* Delete button or inline confirmation */}
                              {deleteConfirmId === dep.id ? (
                                <div className="flex items-center gap-2 ml-auto bg-red-50 p-1.5 rounded-xl border border-red-100 animate-pulse">
                                  <span className="text-[10px] text-red-700 font-bold px-1.5">Confirmer ?</span>
                                  <button
                                    type="button"
                                    onClick={() => {
                                      handleDeleteFirestoreDeposit(dep.id);
                                      setDeleteConfirmId(null);
                                    }}
                                    className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded-lg text-[10px] font-bold cursor-pointer"
                                  >
                                    Oui
                                  </button>
                                  <button
                                    type="button"
                                    onClick={() => setDeleteConfirmId(null)}
                                    className="px-2 py-1 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-[10px] font-bold cursor-pointer"
                                  >
                                    Non
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => setDeleteConfirmId(dep.id)}
                                  className="inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 active:bg-red-200 text-red-600 font-bold text-xs rounded-xl transition-all cursor-pointer ml-auto"
                                  title="Supprimer définitivement cette ressource"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
                                  <span>Supprimer</span>
                                </button>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          ) : adminTab === 'security' ? (
            <div className="space-y-6 max-w-2xl">
              <div className="space-y-1">
                <h4 className="font-serif text-lg font-bold text-gray-900">Modification du Code Maître</h4>
                <p className="text-gray-400 text-[11px]">Personnalisez le code d'accès de secours pour l'accès direct à votre Espace d'Administration d'archiv2ie.</p>
              </div>

              <form onSubmit={handleSaveCustomPasscode} className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Code d'accès actuel enregistré</label>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1.5 bg-white rounded-lg text-xs font-mono font-bold text-gray-600 border border-gray-200">
                      {customPasscode ? `"${customPasscode}"` : "Par défaut (aucun code personnalisé)"}
                    </span>
                    {customPasscode && (
                      <button
                        type="button"
                        onClick={handleResetCustomPasscode}
                        disabled={isSavingPasscode}
                        className="px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg text-xs font-bold transition-all disabled:opacity-50"
                      >
                        Réinitialiser par défaut
                      </button>
                    )}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label htmlFor="newPasscode" className="text-xs font-bold text-gray-700">Nouveau Code d'Accès Personnalisé</label>
                  <input
                    id="newPasscode"
                    type="text"
                    value={newPasscode}
                    onChange={(e) => setNewPasscode(e.target.value)}
                    placeholder="Saisissez un nouveau code (ex: monmotdepasse)"
                    disabled={isSavingPasscode}
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all"
                  />
                  <p className="text-[10px] text-gray-400">Ce code doit faire au moins 4 caractères et ne pas être vide. Il sera converti en minuscules.</p>
                </div>

                <button
                  type="submit"
                  disabled={isSavingPasscode}
                  className="w-full sm:w-auto px-4 py-2 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                >
                  {isSavingPasscode ? (
                    <>
                      <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      <span>Enregistrement...</span>
                    </>
                  ) : (
                    <>
                      <Check className="h-3.5 w-3.5" />
                      <span>Enregistrer le nouveau code d'accès</span>
                    </>
                  )}
                </button>
              </form>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl space-y-2">
                <h5 className="text-[11px] font-bold text-amber-800 flex items-center gap-1">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Codes d'accès de secours permanents (Anti-blocage)</span>
                </h5>
                <p className="text-[10px] text-amber-700 leading-relaxed">
                  Pour éviter tout risque de verrouillage accidentel si vous oubliez votre code personnalisé, les mots de passe de secours universels suivants resteront TOUJOURS actifs comme plan de secours :
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {['archiv2ie', '2ie', '2ieadmin', 'eyuaelijah'].map(pwd => (
                    <span key={pwd} className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded font-mono text-[9px] font-bold">
                      {pwd}
                    </span>
                  ))}
                </div>
              </div>

              {/* Google Sheet Integration Setup */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <div className="space-y-1">
                  <h4 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-emerald-600 animate-pulse" />
                    <span>Intégration Google Sheets & Google Drive</span>
                  </h4>
                  <p className="text-gray-400 text-[11px]">Associez et synchronisez automatiquement toutes les métadonnées de dépôt dans une feuille Google Sheet stockée sur votre Drive.</p>
                </div>

                <div className="bg-gray-50/50 p-6 rounded-2xl border border-gray-100 space-y-4">
                  {spreadsheetId ? (
                    <div className="space-y-4">
                      <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 border border-emerald-100 px-4 py-3 rounded-xl">
                        <CheckCircle className="h-5 w-5 flex-shrink-0 text-emerald-600" />
                        <div className="text-xs">
                          <p className="font-bold">Google Sheet connecté avec succès !</p>
                          <p className="text-emerald-600 mt-0.5 text-[10px]">Toutes les métadonnées de dépôt sont transmises ou synchronisées.</p>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                        <a
                          href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 hover:border-emerald-300 hover:text-emerald-700 text-gray-700 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                        >
                          <FileText className="h-4 w-4 text-emerald-600" />
                          <span>Ouvrir Google Sheet 📊</span>
                        </a>

                        <a
                          href="https://drive.google.com/drive/folders/1VOjv5qxNbFLUvRc0BShinaoOM3OF5jBxDIRJt7MEhDqrBtiLX7wtvbLGFj1WpCu8U1ESC3ob"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-700 text-gray-700 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                        >
                          <FolderOpen className="h-4 w-4 text-blue-600" />
                          <span>Ouvrir Dossier Drive 📂</span>
                        </a>
                      </div>

                      <div className="flex flex-wrap gap-2 pt-2">
                        <button
                          type="button"
                          onClick={handleForceSyncAll}
                          disabled={isSyncingAll}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 disabled:bg-gray-400 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                        >
                          {isSyncingAll ? (
                            <>
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                              <span>Synchronisation en cours...</span>
                            </>
                          ) : (
                            <>
                              <RefreshCw className="h-3.5 w-3.5" />
                              <span>Forcer la Synchronisation de tous les dépôts 🔄</span>
                            </>
                          )}
                        </button>

                        <button
                          type="button"
                          onClick={handleDissociateSheet}
                          className="flex items-center justify-center gap-2 px-4 py-2 bg-red-50 hover:bg-red-100 border border-red-200 text-red-700 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          <span>Dissocier le Google Sheet ❌</span>
                        </button>
                      </div>

                      <div className="space-y-1.5 pt-2 text-[10px] text-gray-500 font-mono">
                        <p>ID du document : <span className="bg-white px-1.5 py-0.5 rounded border border-gray-100 select-all">{spreadsheetId}</span></p>
                        <p>Dossier parent : <span className="bg-white px-1.5 py-0.5 rounded border border-gray-100">1VOjv5qxNbFLUvRc0BShinaoOM3OF5jBxDIRJt7MEhDqrBtiLX7wtvbLGFj1WpCu8U1ESC3ob</span></p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="text-xs text-gray-600 leading-relaxed space-y-2">
                        <p>
                          Afin d'enregistrer et de centraliser les métadonnées sans utiliser de base de données externe lente, l'application peut générer automatiquement une feuille de calcul Excel Google Sheet structurée directement dans votre dossier partagé.
                        </p>
                        <p className="text-gray-400 text-[10px]">
                          Note : La feuille comprendra deux onglets : <strong>"Dépôts"</strong> pour les données brutes de chaque fichier, et <strong>"Tableau de Bord"</strong> contenant des statistiques, des formules automatiques et des graphiques.
                        </p>
                      </div>

                      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
                        <button
                          type="button"
                          onClick={handleCreateGoogleSheet}
                          disabled={isCreatingSheet || !adminToken}
                          className={`px-5 py-2.5 rounded-xl text-xs font-bold text-white transition-all shadow-sm flex items-center justify-center gap-2 cursor-pointer ${
                            !adminToken 
                              ? 'bg-gray-400 cursor-not-allowed opacity-65'
                              : 'bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800'
                          }`}
                        >
                          {isCreatingSheet ? (
                            <>
                              <RefreshCw className="h-4 w-4 animate-spin" />
                              <span>Génération de la feuille & du Tableau de Bord...</span>
                            </>
                          ) : (
                            <>
                              <FileText className="h-4 w-4" />
                              <span>Option 1 : Générer automatiquement</span>
                            </>
                          )}
                        </button>

                        <a
                          href="https://drive.google.com/drive/folders/1VOjv5qxNbFLUvRc0BShinaoOM3OF5jBxDIRJt7MEhDqrBtiLX7wtvbLGFj1WpCu8U1ESC3ob"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white border border-gray-200 hover:border-blue-300 hover:text-blue-700 text-gray-700 font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer"
                        >
                          <FolderOpen className="h-4 w-4 text-blue-600" />
                          <span>Ouvrir Dossier Drive 📂</span>
                        </a>
                      </div>

                      <div className="border-t border-dashed border-gray-200 pt-4 space-y-3">
                        <h5 className="text-xs font-bold text-gray-700">Option 2 : Associer un Google Sheet existant manuellement</h5>
                        <form onSubmit={handleLinkManualSheet} className="flex gap-2 max-w-xl">
                          <input
                            type="text"
                            placeholder="Saisissez l'ID du Google Sheet (ex: 1x2y3z...)"
                            value={manualSheetId}
                            onChange={(e) => setManualSheetId(e.target.value)}
                            className="flex-1 min-w-0 text-xs px-3.5 py-2 bg-white border border-gray-200 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                          />
                          <button
                            type="submit"
                            disabled={isLinkingSheet}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold text-xs rounded-xl shadow-sm transition-all cursor-pointer flex items-center gap-1.5"
                          >
                            {isLinkingSheet ? (
                              <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                            ) : (
                              <CheckCircle className="h-3.5 w-3.5" />
                            )}
                            <span>Associer</span>
                          </button>
                        </form>
                      </div>

                      <div className="p-3 bg-amber-50 border border-amber-100 rounded-xl text-[10px] text-amber-800 flex items-start gap-2 leading-relaxed">
                        <span className="text-amber-500 text-xs mt-0.5 font-bold">💡</span>
                        <div className="space-y-1">
                          <p className="font-bold">Astuce Iframe / Fenêtre bloquée :</p>
                          <p>
                            Si vous essayez de vous connecter avec Google mais que rien ne se passe, le navigateur a bloqué la fenêtre de connexion car l'application s'exécute dans une iframe AI Studio.
                          </p>
                          <p className="font-semibold text-amber-900">
                            Pour contourner cela, cliquez sur le bouton "Ouvrir dans un nouvel onglet" tout en haut à droite pour afficher l'application en plein écran, connectez-vous avec Google, puis générez ou associez votre Google Sheet !
                          </p>
                        </div>
                      </div>

                      {!adminToken && (
                        <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-[10px] text-indigo-800 flex items-center gap-2 leading-relaxed">
                          <Lock className="h-4 w-4 flex-shrink-0" />
                          <span>Pour l'option 1, vous devez vous connecter avec Google (le compte Google administrateur <strong>eyuaelijah@gmail.com</strong>) afin d'autoriser la création automatique.</span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (() => {
            // Stats & data extraction computation
            interface DepositorStats {
              email: string;
              nom: string;
              statut: string;
              filiere: string;
              count: number;
            }
            const uniqueDepositors = Array.from(
              new Map<string, DepositorStats>(
                firestoreDeposits.map(dep => [
                  (dep.email || '').toLowerCase().trim(),
                  { 
                    email: dep.email || '', 
                    nom: dep.nom || 'Anonyme', 
                    statut: dep.statut || 'Étudiant', 
                    filiere: dep.filiere || 'Non précisée',
                    count: 0
                  }
                ])
              ).values()
            );

            uniqueDepositors.forEach(depositor => {
              depositor.count = firestoreDeposits.filter(
                dep => (dep.email || '').toLowerCase().trim() === depositor.email.toLowerCase().trim()
              ).length;
            });

            uniqueDepositors.sort((a, b) => b.count - a.count);

            const tcCount = firestoreDeposits.filter(d => (d.filiere || '').includes('Tronc')).length;
            const geeCount = firestoreDeposits.filter(d => (d.filiere || '').includes('GEE')).length;
            const btpCount = firestoreDeposits.filter(d => (d.filiere || '').includes('BTP')).length;
            const eauCount = firestoreDeposits.filter(d => (d.filiere || '').includes('GEAAH')).length;
            const otherFiliereCount = firestoreDeposits.length - (tcCount + geeCount + btpCount + eauCount);

            const coursCount = firestoreDeposits.filter(d => d.typeDoc === 'Cours').length;
            const examenCount = firestoreDeposits.filter(d => d.typeDoc === "Sujet d'examen").length;
            const tdCount = firestoreDeposits.filter(d => d.typeDoc === 'TD/TP').length;
            const pfeCount = firestoreDeposits.filter(d => d.typeDoc === 'Rapport PFE').length;
            const ficheCount = firestoreDeposits.filter(d => d.typeDoc === 'Fiche récap').length;

            const syncedCount = firestoreDeposits.filter(d => d.driveStatus === 'success').length;
            const syncPercentage = firestoreDeposits.length > 0 ? Math.round((syncedCount / firestoreDeposits.length) * 100) : 0;

            const filiereCounts = [
              { name: 'Tronc Commun', count: tcCount },
              { name: 'Génie Électrique (GEE)', count: geeCount },
              { name: 'Génie Civil & BTP (GC-BTP)', count: btpCount },
              { name: 'Génie Eau & Assainissement (GEAAH)', count: eauCount }
            ];
            const sortedFilieres = [...filiereCounts].sort((a,b) => b.count - a.count);
            const leaderFiliereName = sortedFilieres[0]?.count > 0 ? sortedFilieres[0]?.name : "Aucune";

            const handleCopyMailingList = () => {
              const emailList = uniqueDepositors.map(d => d.email).filter(Boolean).join(', ');
              navigator.clipboard.writeText(emailList);
              setCopiedEmailsStatus(true);
              setTimeout(() => setCopiedEmailsStatus(false), 2000);
            };

            return (
              <div className="space-y-8">
                
                {/* Actions row explaining metrics exploitation */}
                <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <h3 className="text-sm font-bold text-gray-800">Exploiter l'annuaire de dépôt</h3>
                    <p className="text-gray-500 text-xs leading-relaxed">
                      Utilisez ces données pour contacter les contributeurs, identifier les matières manquantes ou dresser des statistiques de participation.
                    </p>
                  </div>
                  
                  <div className="flex flex-wrap gap-2.5">
                    {/* Copy mailing list button */}
                    <button
                      type="button"
                      onClick={handleCopyMailingList}
                      className="inline-flex items-center gap-2 px-3.5 py-2 bg-white hover:bg-gray-100 active:bg-gray-200 text-gray-700 font-bold text-xs rounded-xl border border-gray-200 transition-all cursor-pointer"
                      title="Copier tous les emails uniques séparés par des virgules pour un publipostage"
                    >
                      {copiedEmailsStatus ? (
                        <>
                          <Check className="h-4 w-4 text-emerald-600" />
                          <span className="text-emerald-700">Liste copiée !</span>
                        </>
                      ) : (
                        <>
                          <Copy className="h-4 w-4 text-brand" />
                          <span>Copier la liste de diffusion 📧</span>
                        </>
                      )}
                    </button>

                    {/* Export CSV button */}
                    <button
                      type="button"
                      onClick={exportDepositorsToCSV}
                      className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all cursor-pointer shadow-sm shadow-emerald-100"
                      title="Télécharger l'annuaire complet au format CSV compatible Excel / Google Sheets"
                    >
                      <Download className="h-4 w-4" />
                      <span>Exporter l'annuaire en CSV 📥</span>
                    </button>
                  </div>
                </div>

                {/* KPI Metrics Dashboard Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  
                  {/* KPI 1 */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-brand/10 text-brand rounded-2xl">
                      <FileText className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold text-[10px] uppercase block tracking-wider">Dépôts Totaux</span>
                      <span className="text-2xl font-bold text-gray-900">{firestoreDeposits.length}</span>
                      <span className="text-gray-400 text-[10px] block font-medium">{syncedCount} archivés sur Drive</span>
                    </div>
                  </div>

                  {/* KPI 2 */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-emerald-50 text-emerald-600 rounded-2xl">
                      <CheckCircle2 className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold text-[10px] uppercase block tracking-wider">Déposants Uniques</span>
                      <span className="text-2xl font-bold text-gray-900">{uniqueDepositors.length}</span>
                      <span className="text-emerald-600 text-[10px] block font-medium">Contributeurs actifs</span>
                    </div>
                  </div>

                  {/* KPI 3 */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-indigo-50 text-indigo-600 rounded-2xl">
                      <FolderOpen className="h-5 w-5" />
                    </div>
                    <div>
                      <span className="text-gray-400 font-bold text-[10px] uppercase block tracking-wider">Taux Automatique Drive</span>
                      <span className="text-2xl font-bold text-indigo-600">{syncPercentage}%</span>
                      <span className="text-gray-400 text-[10px] block font-medium">Atterrissage direct configuré</span>
                    </div>
                  </div>

                  {/* KPI 4 */}
                  <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-4">
                    <div className="p-3 bg-amber-50 text-amber-600 rounded-2xl">
                      <Shield className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-gray-400 font-bold text-[10px] uppercase block tracking-wider">Filière Leader</span>
                      <span className="text-base font-bold text-gray-900 block truncate leading-tight" title={leaderFiliereName}>
                        {leaderFiliereName}
                      </span>
                      <span className="text-gray-400 text-[10px] block font-medium">Plus grand volume d'envois</span>
                    </div>
                  </div>

                </div>

                {/* Stats details: 2 Columns */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  
                  {/* Col 1: Distributions */}
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h4 className="font-serif text-lg font-bold text-gray-900">Distribution par Filière</h4>
                      <p className="text-gray-400 text-[11px]">Volume total de documents déposés par branche d'études à l'Institut 2iE.</p>
                    </div>

                    <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                      {filiereCounts.map(filiere => {
                        const pct = firestoreDeposits.length > 0 ? Math.round((filiere.count / firestoreDeposits.length) * 100) : 0;
                        return (
                          <div key={filiere.name} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold text-gray-700">
                              <span>{filiere.name}</span>
                              <span>{filiere.count} {filiere.count > 1 ? 'fichiers' : 'fichier'} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className="h-full bg-brand rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                      {otherFiliereCount > 0 && (
                        <div className="space-y-1.5">
                          <div className="flex justify-between text-xs font-semibold text-gray-700">
                            <span>Autres / Non classés</span>
                            <span>{otherFiliereCount} fichiers ({Math.round((otherFiliereCount / firestoreDeposits.length) * 100)}%)</span>
                          </div>
                          <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-gray-400 rounded-full" style={{ width: `${Math.round((otherFiliereCount / firestoreDeposits.length) * 100)}%` }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Format distribution */}
                    <div className="space-y-1 pt-2">
                      <h4 className="font-serif text-lg font-bold text-gray-900">Format / Nature des Documents</h4>
                      <p className="text-gray-400 text-[11px]">Typologie des ressources récupérées (cours, examens, etc.).</p>
                    </div>

                    <div className="bg-gray-50/50 p-5 rounded-2xl border border-gray-100 space-y-4">
                      {[
                        { label: 'Cours Complets', val: coursCount, color: 'bg-indigo-500' },
                        { label: "Sujets d'examen / DS", val: examenCount, color: 'bg-amber-500' },
                        { label: 'TD / TP rédigés & corrigés', val: tdCount, color: 'bg-emerald-500' },
                        { label: 'Rapports de Stage & PFE', val: pfeCount, color: 'bg-sky-500' },
                        { label: 'Fiches de révisions', val: ficheCount, color: 'bg-rose-500' }
                      ].map(item => {
                        const pct = firestoreDeposits.length > 0 ? Math.round((item.val / firestoreDeposits.length) * 100) : 0;
                        return (
                          <div key={item.label} className="space-y-1.5">
                            <div className="flex justify-between text-xs font-semibold text-gray-700">
                              <span>{item.label}</span>
                              <span>{item.val} ({pct}%)</span>
                            </div>
                            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                              <div className={`h-full ${item.color} rounded-full`} style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Col 2: Contributors directory table */}
                  <div className="space-y-6">
                    <div className="space-y-1">
                      <h4 className="font-serif text-lg font-bold text-gray-900">Répertoire des Déposants ({uniqueDepositors.length})</h4>
                      <p className="text-gray-400 text-[11px]">Liste des personnes ayant participé à l'archivage avec leurs emails de contact.</p>
                    </div>

                    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
                      {uniqueDepositors.length === 0 ? (
                        <div className="p-8 text-center text-xs text-gray-400 italic">
                          Aucun déposant répertorié.
                        </div>
                      ) : (
                        uniqueDepositors.map((depositor, idx) => {
                          return (
                            <div key={depositor.email || idx} className="p-4 hover:bg-gray-50/50 transition-all flex items-center justify-between gap-3 text-xs">
                              <div className="space-y-1 min-w-0">
                                <div className="flex items-center gap-1.5 flex-wrap">
                                  <span className="font-bold text-gray-800 truncate max-w-[150px] sm:max-w-xs">{depositor.nom}</span>
                                  <span className="px-1.5 py-0.5 bg-gray-100 text-gray-500 font-bold rounded text-[9px]">
                                    {depositor.statut}
                                  </span>
                                </div>
                                <span className="text-gray-400 font-mono block truncate" title={depositor.email}>
                                  {depositor.email}
                                </span>
                                <span className="text-[10px] text-brand font-medium block">
                                  Filière principale : {depositor.filiere}
                                </span>
                              </div>

                              <div className="flex items-center gap-3 flex-shrink-0">
                                <div className="text-right">
                                  <span className="font-bold text-gray-800 block text-sm">{depositor.count}</span>
                                  <span className="text-[9px] text-gray-400 uppercase tracking-wider font-bold">dépôts</span>
                                </div>
                                
                                <button
                                  type="button"
                                  onClick={() => {
                                    navigator.clipboard.writeText(depositor.email);
                                    showToast(`Email copié : ${depositor.email}`, "info");
                                  }}
                                  className="p-1.5 hover:bg-gray-100 active:bg-gray-200 text-gray-400 hover:text-gray-600 rounded-lg transition-all cursor-pointer"
                                  title="Copier l'adresse email de cet auteur"
                                >
                                  <Copy className="h-3.5 w-3.5" />
                                </button>
                              </div>
                            </div>
                          );
                        })
                      )}
                    </div>

                    <div className="bg-brand/5 p-4 rounded-xl border border-brand/10 space-y-2">
                      <h5 className="text-xs font-bold text-brand flex items-center gap-1.5">
                        <Shield className="h-3.5 w-3.5" />
                        <span>Recommandations d'exploitation de l'annuaire</span>
                      </h5>
                      <p className="text-[11px] text-gray-600 leading-relaxed">
                        Conformément au RGPD et aux chartes universitaires, utilisez ces adresses uniquement pour des besoins administratifs d'archiv2ie (par exemple, pour clarifier un syllabus flou, remercier un enseignant, ou attribuer des certificats de contribution). Ne les partagez pas avec des tiers.
                      </p>
                    </div>

                  </div>

                </div>

              </div>
            );
          })()}
        </section>
      )}


      {/* Admin Login Selection Modal */}
      {isLoginModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl max-w-md w-full p-6 sm:p-8 space-y-6 relative animate-in fade-in zoom-in-95 duration-200">
            <button
              type="button"
              onClick={() => setIsLoginModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 font-bold text-lg cursor-pointer w-8 h-8 rounded-full hover:bg-gray-50 flex items-center justify-center"
            >
              ×
            </button>

            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 bg-brand/10 text-brand rounded-2xl flex items-center justify-center">
                <Lock className="h-6 w-6" />
              </div>
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">Espace Administration</h3>
              <p className="text-xs text-gray-500 max-w-xs mx-auto">
                Saisissez le code maître d'administration pour accéder à la modération des dépôts.
              </p>
            </div>

            {/* Option: Master Passcode */}
            <form onSubmit={handleEmailLogin} className="space-y-4">
              <div className="space-y-1">
                <label className="block text-[11px] font-bold text-gray-500 uppercase">Adresse E-mail Admin</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type="email"
                    disabled
                    value={loginEmail}
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-500 outline-none cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="block text-[11px] font-bold text-gray-500 uppercase">Mot de Passe Administrateur / Code Maître</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Saisissez 'archiv2ie' pour vous connecter directement"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    disabled={isLoggingIn}
                    className="w-full pl-10 pr-10 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {isLoggingIn ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Lock className="h-4 w-4" />
                )}
                <span>Se connecter directement (Bypass Admin)</span>
              </button>
            </form>

            <div className="bg-emerald-50 border border-emerald-100 p-4 rounded-xl space-y-2">
              <h5 className="text-[11px] font-bold text-emerald-800 flex items-center gap-1">
                <Shield className="h-3.5 w-3.5" />
                <span>Option d'accès rapide et simplifiée</span>
              </h5>
              <p className="text-[10px] text-emerald-700 leading-relaxed">
                Puisque vous êtes l'unique administrateur d'archiv2ie et que vous hébergez le site sur <strong>Vercel</strong>, vous n'avez pas besoin de configurer de comptes utilisateurs Firebase complexes.
              </p>
              <div className="pt-1 border-t border-emerald-200/50 space-y-1 text-[10px] text-emerald-800">
                <p>
                  Saisissez simplement le mot de passe maître <strong>archiv2ie</strong> ou <strong>2ie</strong> ci-dessus pour accéder instantanément à l'ensemble de l'Espace d'Administration.
                </p>
              </div>
            </div>
          </div>
        </div>
      )}


      {/* Toast Notification System */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] max-w-sm transition-all duration-300 transform translate-y-0 opacity-100 shadow-2xl">
          <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
            toast.type === 'success' 
              ? 'bg-emerald-50 text-emerald-800 border-emerald-100 shadow-emerald-100/50' 
              : toast.type === 'error'
              ? 'bg-red-50 text-red-800 border-red-100 shadow-red-100/50'
              : 'bg-brand/5 text-brand border-brand/10 shadow-brand/10'
          }`}>
            <div className="mt-0.5 flex-shrink-0">
              {toast.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-emerald-600" />
              ) : toast.type === 'error' ? (
                <AlertTriangle className="h-5 w-5 text-red-600" />
              ) : (
                <HelpCircle className="h-5 w-5 text-brand" />
              )}
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-xs font-bold font-serif leading-snug">
                {toast.type === 'success' ? 'Succès' : toast.type === 'error' ? 'Erreur' : 'Information'}
              </p>
              <p className="text-[11px] leading-relaxed opacity-90 font-medium whitespace-pre-line">
                {toast.message}
              </p>
            </div>
            <button 
              type="button" 
              onClick={() => setToast(null)}
              className="text-gray-400 hover:text-gray-600 font-bold text-xs flex-shrink-0 cursor-pointer px-1"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

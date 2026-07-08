import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  RefreshCw, 
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
  ExternalLink,
  Trash2,
  AlertTriangle,
  Download,
  Copy,
  Check,
  Plus,
  TrendingUp,
  FileSpreadsheet,
  Database,
  Key,
  Info,
  Award
} from 'lucide-react';
import { User } from 'firebase/auth';
import { googleSignIn, logout, ADMIN_EMAIL, initAuth, emailSignIn } from '../firebase';
import { Page } from '../types';

interface AdminProps {
  setCurrentPage?: (page: Page) => void;
}

export default function Admin({ setCurrentPage }: AdminProps) {
  // Auth & Admin States
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [isLoggingIn, setIsLoggingIn] = useState<boolean>(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  const [authChecked, setAuthChecked] = useState<boolean>(false);

  // Login Modal / Form States
  const [loginEmail, setLoginEmail] = useState<string>('eyuaelijah@gmail.com');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);

  // Firestore Tracking Submissions
  const [firestoreDeposits, setFirestoreDeposits] = useState<any[]>([]);
  const [isLoadingDeposits, setIsLoadingDeposits] = useState<boolean>(false);
  const [expandedDepositId, setExpandedDepositId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  
  // Admin actions & search states
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

  // Toast notifications state
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => {
        setToast(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

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

  // Load custom master passcode and spreadsheet ID when user is admin
  useEffect(() => {
    if (isAdminUser) {
      fetchAdminConfig();
    }
  }, [isAdminUser]);

  // Check auth state on mount
  useEffect(() => {
    const savedLocalAdmin = localStorage.getItem('archiv2ie_local_admin');
    if (savedLocalAdmin === 'true') {
      setIsAdminUser(true);
      setCurrentUser({
        email: ADMIN_EMAIL,
        displayName: 'Administrateur (Secours)',
        uid: 'local-admin-uid',
      } as any);
      setAuthChecked(true);
      
      fetchAdminConfig().then(() => {
        fetchDeposits();
      });
    }

    const unsubscribe = initAuth(
      async (user, token) => {
        if (localStorage.getItem('archiv2ie_local_admin') === 'true') {
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
            fetchAdminConfig().then(() => {
              fetchDeposits();
            });
          }
        }
      },
      () => {
        if (localStorage.getItem('archiv2ie_local_admin') === 'true') {
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

  // Google Sign In login flow
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
        }
      }
    } catch (e: any) {
      console.error("La connexion admin a échoué:", e);
      if (e.code === 'auth/popup-blocked' || String(e).includes('popup-blocked')) {
        showToast(
          `Le navigateur a bloqué la fenêtre de connexion Google (Popup bloqué).\n\n` +
          `👉 Pour vous connecter, veuillez soit :\n` +
          `1. Cliquer sur l'icône de nouvel onglet / plein écran pour exécuter l'application en dehors de l'iframe d'AI Studio.\n` +
          `2. Autoriser les popups dans votre navigateur.\n` +
          `3. Utiliser l'Option de Connexion Directe ci-dessous avec le code de secours "archiv2ie".`,
          "error"
        );
      } else {
        showToast(`Erreur de connexion avec Google. Utilisez le mot de passe de secours pour vous connecter instantanément.`, "error");
      }
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Email/MasterPasscode login flow
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginPassword) {
      showToast("Veuillez saisir votre mot de passe.", "error");
      return;
    }
    setIsLoggingIn(true);

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

        fetchAdminConfig().then(() => {
          fetchDeposits();
        });

        showToast("Connexion d'administration réussie via mot de passe de secours ! Bienvenue.", "success");
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
          setAdminToken(null);
          showToast("Connexion réussie ! Bienvenue sur l'espace admin d'archiv2ie.", "success");
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
      showToast(`Code maître mis à jour avec succès : "${cleanNewPasscode}" !`, "success");
    } catch (err: any) {
      console.error("Erreur lors de l'enregistrement du code d'accès :", err);
      showToast("Une erreur est survenue lors de l'enregistrement.", "error");
    } finally {
      setIsSavingPasscode(false);
    }
  };

  const handleResetPasscode = async () => {
    if (!window.confirm("Voulez-vous supprimer le code maître personnalisé ? Les mots de passe par défaut d'archiv2ie resteront valides.")) {
      return;
    }
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
      showToast("Code d'accès personnalisé supprimé. Retour aux codes d'administration par défaut.", "success");
    } catch (e) {
      console.error(e);
      showToast("Impossible de réinitialiser le code d'accès.", "error");
    } finally {
      setIsSavingPasscode(false);
    }
  };

  const handleSyncToDrive = async (dep: any) => {
    setIsSyncingId(dep.id);
    try {
      if (!dep.base64) {
        showToast("Impossible de renvoyer le fichier : les données de ce fichier volumineux ne sont pas stockées dans Firestore.", "error");
        setIsSyncingId(null);
        return;
      }

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

  // Filter and search deposits for admin view
  const filteredDeposits = firestoreDeposits.filter((dep) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch = !q || 
      (dep.nom || '').toLowerCase().includes(q) ||
      (dep.email || '').toLowerCase().includes(q) ||
      (dep.nomDoc || '').toLowerCase().includes(q) ||
      (dep.matiere || '').toLowerCase().includes(q) ||
      (dep.fileName || '').toLowerCase().includes(q) ||
      (dep.filiere || '').toLowerCase().includes(q) ||
      (dep.id || '').toLowerCase().includes(q);

    if (!matchesSearch) return false;

    if (filterDrive === 'synced') return dep.driveStatus === 'success';
    if (filterDrive === 'pending') return dep.driveStatus !== 'success';
    return true;
  });

  if (!authChecked) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <RefreshCw className="h-10 w-10 animate-spin text-brand mx-auto mb-4" />
        <p className="text-sm text-gray-500 font-medium">Vérification de la session d'administration...</p>
      </div>
    );
  }

  // Not signed in: Show beautiful full-screen isolated Admin Login Section
  if (!isAdminUser) {
    return (
      <div className="max-w-lg mx-auto px-4 py-12 sm:py-20 animate-fade-in" id="admin-login-screen">
        <div className="bg-white rounded-3xl border border-gray-100 shadow-xl p-6 sm:p-10 space-y-8">
          
          <div className="text-center space-y-3">
            <div className="mx-auto w-14 h-14 bg-brand/10 text-brand rounded-2xl flex items-center justify-center shadow-inner">
              <Shield className="h-7 w-7" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">Espace Administration</h1>
            <p className="text-xs sm:text-sm text-gray-500 max-w-sm mx-auto leading-relaxed">
              Section réservée à la modération académique, au suivi des dépôts et à la gestion des intégrations Google Drive d'archiv2ie.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleEmailLogin} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Adresse E-mail Administrateur</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="email"
                  disabled
                  value={loginEmail}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-xs sm:text-sm text-gray-500 outline-none cursor-not-allowed"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">Mot de Passe ou Code Maître</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Saisissez le mot de passe administrateur"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  disabled={isLoggingIn}
                  className="w-full pl-11 pr-11 py-3 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs sm:text-sm transition-all outline-none"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs sm:text-sm transition-all shadow-md hover:shadow-lg cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2 transform active:scale-[0.99]"
            >
              {isLoggingIn ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Lock className="h-4 w-4" />
              )}
              <span>Se connecter directement (Bypass Admin)</span>
            </button>
          </form>

          {/* Secure Google Login alternative */}
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-100"></div>
            </div>
            <span className="relative px-3 bg-white text-[11px] font-bold text-gray-400 uppercase tracking-wider">OU</span>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={isLoggingIn}
            className="w-full py-3.5 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold rounded-xl text-xs sm:text-sm transition-all shadow-sm hover:bg-gray-50 cursor-pointer flex items-center justify-center gap-2.5"
          >
            <svg className="h-4 w-4 sm:h-5 sm:w-5" viewBox="0 0 24 24">
              <path fill="#EA4335" d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.578-7.859-8s3.529-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.245-3.13C18.23 1.956 15.418 1 12.24 1c-6.075 0-11 4.925-11 11s4.925 11 11 11c6.34 0 10.55-4.453 10.55-10.74 0-.724-.078-1.275-.175-1.785l-10.375.01z" />
            </svg>
            <span>S'authentifier avec Google Admin</span>
          </button>

          {/* Bypass Info card */}
          <div className="bg-emerald-50/50 border border-emerald-100 p-5 rounded-2xl space-y-2">
            <h5 className="text-xs font-bold text-emerald-800 flex items-center gap-1.5">
              <Shield className="h-4 w-4 text-emerald-600" />
              <span>Accès d'urgence simplifié</span>
            </h5>
            <p className="text-[11px] sm:text-xs text-emerald-700 leading-relaxed">
              En tant que gestionnaire d'archiv2ie, utilisez le code maître de secours <strong>archiv2ie</strong> dans le formulaire ci-dessus pour déverrouiller instantanément le panneau.
            </p>
          </div>

          <div className="text-center pt-2">
            <button 
              onClick={() => setCurrentPage?.('home')}
              className="text-xs text-gray-400 hover:text-brand font-semibold transition-all"
            >
              ← Retour au portail public
            </button>
          </div>
        </div>

        {/* Toast Local to Login */}
        {toast && (
          <div className="fixed bottom-6 right-6 z-[100] max-w-sm shadow-2xl">
            <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
              toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100' : 'bg-red-50 text-red-800 border-red-100'
            }`}>
              <div className="flex-1 text-xs font-medium">{toast.message}</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // LOGGED IN: Show Full Admin Panel Workspace
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 animate-fade-in space-y-8" id="admin-dashboard-container">
      
      {/* Header and overview */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-pulse" />
            <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-600">Session d'Administration Active</span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900 tracking-tight">
            Espace d'Administration d'archiv2ie
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 leading-relaxed max-w-2xl">
            Pilotez les soumissions universitaires d'archiv2ie, validez les documents d'étude de l'Institut 2iE et gérez l'infrastructure cloud liée au stockage Google Drive.
          </p>
        </div>

        {/* Authenticated Admin Account Card */}
        <div className="flex items-center gap-3 bg-gray-50 border border-gray-100 p-3 rounded-2xl self-start md:self-center">
          <div className="w-10 h-10 rounded-full bg-brand text-white flex items-center justify-center font-bold text-sm shadow-sm" title={currentUser?.email || ''}>
            {currentUser?.displayName?.[0] || 'A'}
          </div>
          <div className="text-left">
            <span className="text-[9px] uppercase font-bold text-gray-400 block tracking-wider">Modérateur Connecté</span>
            <span className="text-xs font-bold text-gray-700 truncate block max-w-[150px]">{currentUser?.email}</span>
          </div>
          <button
            type="button"
            onClick={handleAdminLogout}
            className="ml-2 inline-flex items-center gap-1.5 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition-all border border-red-100/50 cursor-pointer"
            title="Se déconnecter de la session d'administration"
          >
            <LogOut className="h-3.5 w-3.5" />
            <span>Quitter</span>
          </button>
        </div>
      </div>

      {/* Main Tab Switcher */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row gap-4 justify-between items-stretch lg:items-center bg-gray-50 p-2.5 rounded-2xl border border-gray-100">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => {
                if (adminTab === 'security') {
                  setAdminTab('list');
                }
              }}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                adminTab !== 'security'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200/60'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-white/50 border border-transparent'
              }`}
            >
              <FolderOpen className={`h-4 w-4 ${adminTab !== 'security' ? 'text-brand' : 'text-gray-400'}`} />
              <span>Exploitation des données</span>
            </button>

            <button
              type="button"
              onClick={() => setAdminTab('security')}
              className={`flex-1 sm:flex-initial flex items-center justify-center gap-2 px-5 py-3 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                adminTab === 'security'
                  ? 'bg-white text-gray-900 shadow-sm border border-gray-200/60'
                  : 'text-gray-500 hover:text-gray-900 hover:bg-white/50 border border-transparent'
              }`}
            >
              <Shield className={`h-4 w-4 ${adminTab === 'security' ? 'text-brand' : 'text-gray-400'}`} />
              <span>Configuration & Sécurité</span>
            </button>
          </div>

          {/* Sub-tabs for data exploitation when active */}
          {adminTab !== 'security' && (
            <div className="flex p-1 bg-gray-200/50 rounded-xl gap-1.5 self-start lg:self-center">
              <button
                type="button"
                onClick={() => setAdminTab('list')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  adminTab === 'list'
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-950'
                }`}
              >
                📋 Liste des documents ({filteredDeposits.length})
              </button>
              <button
                type="button"
                onClick={() => setAdminTab('stats')}
                className={`px-4 py-2 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                  adminTab === 'stats'
                    ? 'bg-brand text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-950'
                }`}
              >
                📊 Statistiques & Synthèse
              </button>
            </div>
          )}
        </div>

        {/* Tab 1: List View */}
        {adminTab === 'list' ? (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
              {/* Search Bar */}
              <div className="relative w-full sm:max-w-md">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Rechercher par titre, auteur, e-mail, matière..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none"
                />
              </div>

              {/* Filtering Controls */}
              <div className="flex gap-1.5 self-start sm:self-center">
                <button
                  type="button"
                  onClick={() => setFilterDrive('all')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    filterDrive === 'all' 
                      ? 'bg-gray-900 text-white shadow-sm' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  Tous ({firestoreDeposits.length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDrive('synced')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    filterDrive === 'synced' 
                      ? 'bg-emerald-600 text-white shadow-sm' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  Synchronisés ({firestoreDeposits.filter(d => d.driveStatus === 'success').length})
                </button>
                <button
                  type="button"
                  onClick={() => setFilterDrive('pending')}
                  className={`px-3.5 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer ${
                    filterDrive === 'pending' 
                      ? 'bg-amber-600 text-white shadow-sm' 
                      : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
                  }`}
                >
                  En attente ({firestoreDeposits.filter(d => d.driveStatus !== 'success').length})
                </button>
              </div>
            </div>

            {/* Deposits list rendering */}
            {isLoadingDeposits ? (
              <div className="text-center py-16">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto text-brand mb-2" />
                <span className="text-xs text-gray-400 font-semibold">Chargement de l'index des dépôts depuis Firestore...</span>
              </div>
            ) : filteredDeposits.length === 0 ? (
              <div className="text-center py-16 flex flex-col items-center justify-center space-y-4 bg-gray-50/50 rounded-2xl border border-gray-100">
                <FileText className="h-12 w-12 text-gray-300" />
                <h3 className="text-sm font-bold text-gray-700">Aucun dépôt disponible</h3>
                <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
                  Aucun dépôt d'étudiant ne correspond aux critères de recherche actuels.
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
                        isExpanded ? 'bg-brand/5/10 -mx-4 px-4 py-4 rounded-2xl border border-brand/10' : ''
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div 
                          className="flex-1 cursor-pointer"
                          onClick={() => setExpandedDepositId(isExpanded ? null : dep.id)}
                        >
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-mono text-[10px] font-bold text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded">
                              {dep.id}
                            </span>
                            <span className="text-[10px] text-gray-400">{dep.date}</span>
                            
                            {/* Filiere Badge */}
                            <span className="px-1.5 py-0.5 rounded-md text-[10px] font-bold bg-gray-100 text-gray-600 border border-gray-200/50">
                              {dep.filiere} ({dep.semestre})
                            </span>

                            {/* Drive Status Badge */}
                            {isSynced ? (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-100">
                                <CheckCircle className="h-2.5 w-2.5" />
                                <span>Synchronisé</span>
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-amber-700 border border-amber-100 animate-pulse">
                                <AlertTriangle className="h-2.5 w-2.5" />
                                <span>En attente Drive</span>
                              </span>
                            )}
                          </div>

                          <h4 className="font-serif font-bold text-gray-900 mt-1.5 hover:text-brand transition-colors text-sm sm:text-base">
                            {dep.nomDoc}
                          </h4>
                          <p className="text-xs text-gray-500 mt-1">
                            Matière : <span className="font-semibold text-gray-700">{dep.matiere}</span> · Déposé par : <span className="font-semibold text-gray-700">{dep.nom}</span> ({dep.statut})
                          </p>
                        </div>

                        {/* Expand / Collapse and Delete buttons */}
                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            onClick={() => setExpandedDepositId(isExpanded ? null : dep.id)}
                            className="p-1.5 hover:bg-gray-100 text-gray-500 hover:text-gray-900 rounded-lg text-xs font-semibold cursor-pointer"
                          >
                            {isExpanded ? 'Masquer' : 'Détails'}
                          </button>

                          {deleteConfirmId === dep.id ? (
                            <div className="flex items-center gap-1 bg-red-50 p-1 rounded-xl border border-red-100">
                              <button
                                type="button"
                                onClick={() => handleDeleteFirestoreDeposit(dep.id)}
                                className="px-2 py-1 bg-red-600 text-white rounded-lg text-[10px] font-bold hover:bg-red-700 cursor-pointer"
                              >
                                Confirmer
                              </button>
                              <button
                                type="button"
                                onClick={() => setDeleteConfirmId(null)}
                                className="px-1.5 py-1 text-gray-500 rounded-lg text-[10px] font-medium hover:bg-white cursor-pointer"
                              >
                                Annuler
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setDeleteConfirmId(dep.id)}
                              className="p-1.5 hover:bg-red-50 text-gray-400 hover:text-red-600 rounded-lg cursor-pointer"
                              title="Supprimer ce dépôt de l'index"
                            >
                              <Trash2 className="h-4 w-4" />
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Expanded Panel */}
                      {isExpanded && (
                        <div className="mt-4 pt-4 border-t border-dashed border-gray-100 space-y-4 text-xs animate-in slide-in-from-top-3 duration-200">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-2xl border border-gray-100/50">
                            <div className="space-y-2">
                              <p className="text-gray-500">
                                <strong className="text-gray-700 block mb-0.5">Fichier source :</strong> 
                                <span className="font-mono text-[11px] bg-white px-2 py-1 rounded border border-gray-200/50 block truncate">
                                  {dep.fileName} ({dep.fileSize || 'Inconnue'})
                                </span>
                              </p>
                              <p className="text-gray-500">
                                <strong className="text-gray-700 block mb-0.5">Adresse e-mail du déposant :</strong> 
                                <span className="font-mono text-[11px] bg-white px-2 py-1 rounded border border-gray-200/50 block select-all">
                                  {dep.email}
                                </span>
                              </p>
                              {dep.commentaire && (
                                <p className="text-gray-500">
                                  <strong className="text-gray-700 block mb-0.5">Commentaire de l'étudiant :</strong> 
                                  <span className="italic block bg-white px-3 py-2 rounded border border-gray-200/50 leading-relaxed text-gray-600">
                                    "{dep.commentaire}"
                                  </span>
                                </p>
                              )}
                            </div>

                            <div className="space-y-2.5">
                              <div>
                                <strong className="text-gray-700 block mb-1">Actions d'administration :</strong>
                                <div className="flex flex-wrap gap-1.5">
                                  {/* Download file */}
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadFile(dep)}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold rounded-lg cursor-pointer"
                                  >
                                    <Download className="h-3.5 w-3.5 text-brand" />
                                    <span>Télécharger</span>
                                  </button>

                                  {/* Copy Metadata */}
                                  <button
                                    type="button"
                                    onClick={() => handleCopyMetadata(dep)}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold rounded-lg cursor-pointer"
                                  >
                                    {copiedId === dep.id ? (
                                      <>
                                        <Check className="h-3.5 w-3.5 text-emerald-600" />
                                        <span className="text-emerald-700 font-bold">Copié !</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="h-3.5 w-3.5 text-gray-500" />
                                        <span>Copier Métadonnées</span>
                                      </>
                                    )}
                                  </button>

                                  {/* Export JSON metadata only */}
                                  <button
                                    type="button"
                                    onClick={() => handleDownloadJSON(dep)}
                                    className="inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-700 font-bold rounded-lg cursor-pointer"
                                  >
                                    <FileText className="h-3.5 w-3.5 text-blue-500" />
                                    <span>Exporter Fiche (JSON)</span>
                                  </button>
                                </div>
                              </div>

                              <div>
                                <strong className="text-gray-700 block mb-1">Réseau Google Drive :</strong>
                                <div className="flex flex-wrap gap-1.5 items-center">
                                  {isSynced ? (
                                    <a
                                      href={dep.driveFileId?.startsWith('http') ? dep.driveFileId : `https://drive.google.com/drive/my-drive`}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-200 font-bold rounded-lg transition-colors cursor-pointer"
                                    >
                                      <ExternalLink className="h-3.5 w-3.5" />
                                      <span>Ouvrir sur Drive</span>
                                    </a>
                                  ) : (
                                    <button
                                      type="button"
                                      onClick={() => handleSyncToDrive(dep)}
                                      disabled={isSyncingId === dep.id}
                                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-lg cursor-pointer disabled:opacity-50"
                                    >
                                      {isSyncingId === dep.id ? (
                                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                                      ) : (
                                        <RefreshCw className="h-3.5 w-3.5" />
                                      )}
                                      <span>Tenter une télétransmission</span>
                                    </button>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>

                          {dep.isLargeFile && (
                            <div className="bg-amber-50 text-amber-800 border border-amber-100/60 p-3 rounded-xl flex items-start gap-2.5">
                              <AlertTriangle className="h-4 w-4 text-amber-600 mt-0.5 flex-shrink-0" />
                              <p className="leading-relaxed text-[11px]">
                                ⚠️ <strong>Fichier Volumineux ({dep.fileSize}) :</strong> Ce document a été envoyé directement sur votre Google Drive d'administration. Il n'est pas stocké dans la base de données centrale Firestore pour des raisons de limites de taille.
                              </p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : adminTab === 'stats' ? (
          /* Tab 2: Dashboard stats & Annuaire */
          <div className="space-y-8 pt-2">
            
            {/* Stat Cards Row */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-brand/10 text-brand rounded-xl">
                  <FileText className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Total des dépôts</span>
                  <strong className="text-xl sm:text-2xl text-gray-900 font-serif font-bold">{firestoreDeposits.length}</strong>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
                  <CheckCircle className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Fichiers Synchronisés</span>
                  <strong className="text-xl sm:text-2xl text-gray-900 font-serif font-bold">
                    {firestoreDeposits.filter(d => d.driveStatus === 'success').length}
                  </strong>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-amber-50 text-amber-600 rounded-xl animate-pulse">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">En attente Drive</span>
                  <strong className="text-xl sm:text-2xl text-gray-900 font-serif font-bold">
                    {firestoreDeposits.filter(d => d.driveStatus !== 'success').length}
                  </strong>
                </div>
              </div>

              <div className="bg-gray-50 border border-gray-100 p-5 rounded-2xl flex items-center gap-4 shadow-sm">
                <div className="p-3 bg-purple-50 text-purple-600 rounded-xl">
                  <TrendingUp className="h-6 w-6" />
                </div>
                <div>
                  <span className="text-[10px] text-gray-400 uppercase font-bold tracking-wider block">Contributeurs uniques</span>
                  <strong className="text-xl sm:text-2xl text-gray-900 font-serif font-bold">
                    {new Set(firestoreDeposits.map(d => d.email?.toLowerCase().trim())).size}
                  </strong>
                </div>
              </div>
            </div>

            {/* Filières distribution & CSV Export */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Distribution por filiere */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4">
                <h4 className="font-serif font-bold text-gray-900 text-sm sm:text-base border-b border-gray-100 pb-3">
                  Distribution par Filière
                </h4>
                <div className="space-y-3 text-xs">
                  {[
                    { label: "Tronc Commun S1-S4", color: "bg-brand", count: firestoreDeposits.filter(d => d.filiere === 'tc' || d.filiere?.includes('Tronc')).length },
                    { label: "Génie Électrique & Énergies (GEE)", color: "bg-red-500", count: firestoreDeposits.filter(d => d.filiere === 'gee' || d.filiere?.includes('GEE') || d.filiere?.includes('Électrique')).length },
                    { label: "Génie Civil & BTP (GC-BTP)", color: "bg-amber-500", count: firestoreDeposits.filter(d => d.filiere === 'gc-btp' || d.filiere?.includes('Civil') || d.filiere?.includes('BTP')).length },
                    { label: "Eau, Assainissement & AH (GEAAH)", color: "bg-blue-500", count: firestoreDeposits.filter(d => d.filiere === 'geaah' || d.filiere?.includes('GEAAH') || d.filiere?.includes('Eau')).length }
                  ].map((branch, idx) => {
                    const percentage = firestoreDeposits.length > 0 
                      ? Math.round((branch.count / firestoreDeposits.length) * 100) 
                      : 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between font-medium">
                          <span className="text-gray-600 truncate max-w-[200px]">{branch.label}</span>
                          <span className="text-gray-900 font-bold">{branch.count} ({percentage}%)</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${branch.color}`} style={{ width: `${percentage}%` }} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Contributor statistics / export */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm space-y-4 md:col-span-2">
                <div className="flex justify-between items-center border-b border-gray-100 pb-3">
                  <h4 className="font-serif font-bold text-gray-900 text-sm sm:text-base">
                    Annuaire & Trophées des Contributeurs d'archiv2ie
                  </h4>
                  <button
                    type="button"
                    onClick={exportDepositorsToCSV}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-900 hover:bg-black text-white rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Exporter CSV</span>
                  </button>
                </div>

                <div className="overflow-x-auto text-xs">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase text-[9px] tracking-wider">
                        <th className="py-2.5">Déposant / Étudiant</th>
                        <th className="py-2.5">E-mail</th>
                        <th className="py-2.5 text-center">Fichiers partagés</th>
                        <th className="py-2.5 text-right">Trophée / Statut</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-gray-600">
                      {(() => {
                        const contributorMap: Record<string, { nom: string; email: string; count: number; role: string }> = {};
                        firestoreDeposits.forEach((dep) => {
                          const em = (dep.email || 'etudiant@2ie-edu.org').toLowerCase().trim();
                          if (!contributorMap[em]) {
                            contributorMap[em] = {
                              nom: dep.nom || 'Anonyme',
                              email: dep.email || em,
                              count: 0,
                              role: dep.statut || 'Etudiant'
                            };
                          }
                          contributorMap[em].count += 1;
                        });

                        const sortedContributors = Object.values(contributorMap).sort((a, b) => b.count - a.count);

                        if (sortedContributors.length === 0) {
                          return (
                            <tr>
                              <td colSpan={4} className="py-8 text-center text-gray-400">
                                Aucun contributeur d'enregistré.
                              </td>
                            </tr>
                          );
                        }

                        return sortedContributors.slice(0, 5).map((user, idx) => {
                          let badgeStyle = "bg-gray-100 text-gray-600";
                          let badgeName = "Initié";
                          if (user.count >= 10) {
                            badgeStyle = "bg-purple-100 text-purple-700 font-bold border border-purple-200/50";
                            badgeName = "Légende 2iE";
                          } else if (user.count >= 5) {
                            badgeStyle = "bg-amber-100 text-amber-700 font-bold border border-amber-200/50";
                            badgeName = "Doyen";
                          } else if (user.count >= 2) {
                            badgeStyle = "bg-blue-100 text-blue-700 font-bold border border-blue-200/50";
                            badgeName = "Pilier";
                          }

                          return (
                            <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                              <td className="py-3 font-bold text-gray-900 flex items-center gap-2">
                                <div className="w-6 h-6 bg-brand/10 text-brand rounded-full flex items-center justify-center font-bold text-[10px]">
                                  {user.nom?.[0] || 'E'}
                                </div>
                                <span className="truncate max-w-[150px]">{user.nom}</span>
                              </td>
                              <td className="py-3 font-mono text-[11px] text-gray-400 select-all">{user.email}</td>
                              <td className="py-3 font-bold text-center text-gray-900">{user.count} doc{user.count > 1 ? 's' : ''}</td>
                              <td className="py-3 text-right">
                                <span className={`px-2 py-0.5 rounded-full text-[9px] ${badgeStyle} inline-flex items-center gap-1`}>
                                  <Award className="h-2.5 w-2.5" />
                                  <span>{badgeName}</span>
                                </span>
                              </td>
                            </tr>
                          );
                        });
                      })()}
                    </tbody>
                  </table>
                </div>

                <div className="bg-blue-50 border border-blue-100 p-4 rounded-xl flex items-start gap-3">
                  <Info className="h-4.5 w-4.5 text-blue-600 mt-0.5 flex-shrink-0" />
                  <p className="text-[10px] text-blue-700 leading-relaxed">
                    Conformément au RGPD et aux chartes universitaires, utilisez ces adresses uniquement pour des besoins administratifs d'archiv2ie (par exemple, pour clarifier un syllabus flou, remercier un enseignant, ou attribuer des certificats de contribution). Ne les partagez pas avec des tiers.
                  </p>
                </div>
              </div>

            </div>
          </div>
        ) : (
          /* Tab 3: Security & Passcode Configuration */
          <div className="space-y-8 pt-2">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Box A: Passcode customization */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                  <div className="p-2 bg-brand/10 text-brand rounded-xl">
                    <Key className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif font-bold text-gray-900 text-sm sm:text-base">
                    Code d'accès d'administration
                  </h3>
                </div>

                <p className="text-gray-500 text-xs leading-relaxed">
                  Personnalisez le code d'accès de secours pour l'accès direct à votre Espace d'Administration d'archiv2ie.
                </p>

                <form onSubmit={handleSaveCustomPasscode} className="space-y-4 pt-1">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">Statut du code maître</label>
                    <div className="text-xs font-bold text-gray-800">
                      {customPasscode ? (
                        <span className="text-emerald-600 flex items-center gap-1.5">
                          <CheckCircle className="h-4 w-4" />
                          <span>Code personnalisé actif : "{customPasscode}"</span>
                        </span>
                      ) : (
                        <span className="text-amber-600 flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Pas de code personnalisé (codes par défaut d'archiv2ie actifs)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-500">Nouveau code maître d'accès</label>
                    <input
                      type="text"
                      placeholder="Saisissez un code d'administration unique"
                      value={newPasscode}
                      onChange={(e) => setNewPasscode(e.target.value)}
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs transition-all outline-none focus:bg-white focus:border-brand focus:ring-2 focus:ring-brand/10"
                    />
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={isSavingPasscode}
                      className="flex-1 py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs transition-all shadow-sm cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1.5"
                    >
                      {isSavingPasscode ? (
                        <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                      ) : (
                        <Check className="h-3.5 w-3.5" />
                      )}
                      <span>Sauvegarder</span>
                    </button>

                    {customPasscode && (
                      <button
                        type="button"
                        onClick={handleResetPasscode}
                        disabled={isSavingPasscode}
                        className="px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-bold border border-red-100 rounded-xl text-xs transition-all cursor-pointer"
                      >
                        Réinitialiser
                      </button>
                    )}
                  </div>
                </form>

                <div className="bg-gray-50 border border-gray-100 p-4 rounded-xl space-y-1.5 text-[10px] text-gray-500">
                  <p className="font-bold text-gray-700">Mots de passe par défaut d'archiv2ie :</p>
                  <div className="flex flex-wrap gap-1">
                    {['archiv2ie', '2ie', '2ieadmin', 'eyuaelijah'].map(pwd => (
                      <span key={pwd} className="px-1.5 py-0.5 bg-white border border-gray-200 rounded font-mono font-bold text-gray-600">
                        {pwd}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Box B: Google Sheet Cloud Sync Integration */}
              <div className="bg-white rounded-2xl border border-gray-100 p-5 sm:p-6 shadow-sm space-y-4">
                <div className="flex items-center gap-2.5 border-b border-gray-100 pb-3">
                  <div className="p-2 bg-brand/10 text-brand rounded-xl">
                    <FileSpreadsheet className="h-5 w-5" />
                  </div>
                  <h3 className="font-serif font-bold text-gray-900 text-sm sm:text-base">
                    Intégration Google Sheet & Drive Cloud Sync
                  </h3>
                </div>

                <p className="text-gray-500 text-xs leading-relaxed">
                  Liez un tableau de bord Google Sheet pour synchroniser instantanément toutes les fiches de dépôts universitaires des étudiants de 2iE en temps réel.
                </p>

                <div className="space-y-4 pt-1">
                  <div className="space-y-1">
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider">État de l'intégration</label>
                    <div className="text-xs font-bold text-gray-800">
                      {spreadsheetId ? (
                        <div className="space-y-1.5">
                          <span className="text-emerald-600 flex items-center gap-1.5">
                            <CheckCircle className="h-4 w-4" />
                            <span>Synchronisation Active</span>
                          </span>
                          <span className="font-mono text-[10px] bg-gray-50 border border-gray-100 px-2 py-1 rounded block truncate select-all">
                            ID : {spreadsheetId}
                          </span>
                        </div>
                      ) : (
                        <span className="text-amber-600 flex items-center gap-1.5">
                          <AlertTriangle className="h-4 w-4" />
                          <span>Aucun Google Sheet associé (Données stockées uniquement sur Firestore)</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {spreadsheetId ? (
                    <div className="space-y-2">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <a
                          href={`https://docs.google.com/spreadsheets/d/${spreadsheetId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-sm transition-all cursor-pointer"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                          <span>Ouvrir Google Sheet</span>
                        </a>

                        <button
                          type="button"
                          onClick={handleForceSyncAll}
                          disabled={isSyncingAll}
                          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isSyncingAll ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <RefreshCw className="h-3.5 w-3.5" />
                          )}
                          <span>Forcer la synchronisation intégrale</span>
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={handleDissociateSheet}
                        className="w-full py-2 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Dissocier le Google Sheet
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {/* Option 1: Automatic */}
                      <div className="border border-brand/20 bg-brand/5/10 p-4 rounded-xl space-y-2">
                        <span className="px-2 py-0.5 bg-brand text-white font-bold text-[9px] rounded-full uppercase">Option 1</span>
                        <h4 className="font-bold text-gray-900 text-xs">Générer un tableau de bord pré-formaté automatisé</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          Créez automatiquement un classeur Excel Google Sheets formaté comprenant des formules de rapports, d'annuaires et de statistiques dans un dossier Google Drive d'archiv2ie.
                        </p>
                        <button
                          type="button"
                          onClick={handleCreateGoogleSheet}
                          disabled={isCreatingSheet || !adminToken}
                          className="inline-flex items-center gap-1.5 px-3 py-2 bg-brand hover:bg-brand-hover text-white font-bold rounded-lg text-xs shadow-sm transition-all cursor-pointer disabled:opacity-50"
                        >
                          {isCreatingSheet ? (
                            <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                          ) : (
                            <FileSpreadsheet className="h-3.5 w-3.5" />
                          )}
                          <span>Générer automatiquement le Google Sheet</span>
                        </button>
                        {!adminToken && (
                          <p className="text-[10px] text-amber-700 bg-amber-50 border border-amber-100/50 p-2 rounded-lg leading-relaxed flex items-start gap-1">
                            <AlertTriangle className="h-3 w-3 mt-0.5 flex-shrink-0" />
                            <span>Vous devez vous connecter avec Google (le compte Google administrateur <strong>eyuaelijah@gmail.com</strong>) afin d'autoriser la création automatique.</span>
                          </p>
                        )}
                      </div>

                      {/* Option 2: Manual linkage */}
                      <div className="border border-gray-200 bg-white p-4 rounded-xl space-y-3">
                        <span className="px-2 py-0.5 bg-gray-500 text-white font-bold text-[9px] rounded-full uppercase">Option 2</span>
                        <h4 className="font-bold text-gray-900 text-xs">Associer manuellement un Google Sheet existant</h4>
                        <p className="text-[11px] text-gray-500 leading-relaxed">
                          Saisissez l'ID de votre Google Sheet pour connecter manuellement l'indexation.
                        </p>
                        <form onSubmit={handleLinkManualSheet} className="flex gap-2">
                          <input
                            type="text"
                            placeholder="ID du spreadsheet (ex: 1VOjv5qxNbFL...)"
                            value={manualSheetId}
                            onChange={(e) => setManualSheetId(e.target.value)}
                            className="flex-1 px-3 py-2 bg-gray-50 focus:bg-white border border-gray-200 rounded-lg text-xs outline-none"
                          />
                          <button
                            type="submit"
                            disabled={isLinkingSheet}
                            className="px-3 py-2 bg-gray-900 hover:bg-black text-white font-bold rounded-lg text-xs cursor-pointer disabled:opacity-50 flex items-center justify-center gap-1"
                          >
                            {isLinkingSheet && <RefreshCw className="h-3 w-3 animate-spin" />}
                            <span>Associer</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  )}

                </div>
              </div>

            </div>
          </div>
        )}
      </section>

      {/* Local Toast System for Admin panel */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] max-w-sm shadow-2xl">
          <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
            toast.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-100 shadow-emerald-100/50' : 'bg-red-50 text-red-800 border-red-100 shadow-red-100/50'
          }`}>
            <div className="flex-1 text-xs font-semibold leading-relaxed">{toast.message}</div>
          </div>
        </div>
      )}
    </div>
  );
}

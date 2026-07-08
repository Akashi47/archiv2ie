import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  CheckCircle2, 
  CheckCircle,
  Shield, 
  AlertTriangle, 
  ChevronRight, 
  RefreshCw, 
  File,
  Clock,
  Download,
  Copy,
  ChevronDown,
  Check,
  FileText,
  Lock,
  LogOut,
  HelpCircle
} from 'lucide-react';
import { User } from 'firebase/auth';
import { logout, ADMIN_EMAIL, initAuth } from '../firebase';
import { Page } from '../types';

// ID du dossier Google Drive cible pour archiv2ie
export const TARGET_DRIVE_FOLDER_ID = '1PG54uEpzOq4lq3ctLrnBYRTyWgNTo4HD-k3I43i7GpqS5hFlQeJ_RcS6zFs4nn0qZRuwOsHo';

// Helper to prevent infinite hangs on Firestore or network calls
const withTimeout = <T,>(promise: Promise<T>, timeoutMs: number, errorMessage: string): Promise<T> => {
  return Promise.race([
    promise,
    new Promise<never>((_, reject) => setTimeout(() => reject(new Error(errorMessage)), timeoutMs))
  ]);
};

interface ContribuerProps {
  setCurrentPage?: (page: Page) => void;
}

export default function Contribuer({ setCurrentPage }: ContribuerProps) {
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

  // Auth & Admin States (used only to show current moderator badge and redirect to admin workspace)
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAdminUser, setIsAdminUser] = useState<boolean>(false);
  const [authChecked, setAuthChecked] = useState<boolean>(false);
  const [showAdminTrigger, setShowAdminTrigger] = useState<boolean>(false);
  const [titleClicks, setTitleClicks] = useState<number>(0);

  // Success confirmation screen state
  const [showSubmissionSuccess, setShowSubmissionSuccess] = useState<boolean>(false);
  const [successDetails, setSuccessDetails] = useState<{ nom: string; nomDoc: string } | null>(null);

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
    }

    const unsubscribe = initAuth(
      (user) => {
        if (localStorage.getItem('archiv2ie_local_admin') === 'true') {
          return;
        }
        setCurrentUser(user);
        setIsAdminUser(user?.email === ADMIN_EMAIL);
        setAuthChecked(true);
      },
      () => {
        if (localStorage.getItem('archiv2ie_local_admin') === 'true') {
          return;
        }
        setCurrentUser(null);
        setIsAdminUser(false);
        setAuthChecked(true);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleAdminLogout = async () => {
    localStorage.removeItem('archiv2ie_local_admin');
    await logout();
    setCurrentUser(null);
    setIsAdminUser(false);
    showToast("Vous avez été déconnecté de l'espace d'administration.", "info");
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
      let driveStatus = 'pending';

      // 1. Save metadata with full base64 to central server for robust Direct Google Drive Uploading
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
        base64: base64Data,
        isLargeFile: selectedFile.size > 5000000,
        createdAt: new Date().toISOString()
      };

      try {
        await withTimeout(
          fetch('/api/deposits', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newDepot)
          }),
          30000,
          "Le serveur met trop de temps à répondre. Veuillez vérifier votre connexion internet."
        );
      } catch (errDb) {
        console.error("Erreur d'enregistrement du dépôt sur le backend:", errDb);
      }

      // 2. Submit backup/large file to original Google Apps Script inside hidden iframe asynchronously
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

      setIsSubmitting(false);

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

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header and page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-3 max-w-4xl">
          <h1 
            className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight"
          >
            Contribuer au Projet
          </h1>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            Vous détenez des supports de cours de qualité, des examens corrigés, ou votre rapport de stage d'excellence ? Rejoignez l'effort d'archivage d'<strong>archiv2ie</strong>. Partagez vos documents pour faire grandir la bibliothèque numérique communautaire de l'Institut 2iE.
          </p>
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
            <strong className="block font-serif text-base text-gray-900">Document PDF</strong>
            <p className="text-xs text-gray-500 leading-relaxed">
              Sélectionnez ou glissez-déposez votre document au format PDF (limite de 15 Mo par fichier).
            </p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-brand/10 text-brand flex items-center justify-center font-bold font-serif text-lg">
              3
            </div>
            <strong className="block font-serif text-base text-gray-900">Vérification</strong>
            <p className="text-xs text-gray-500 leading-relaxed">
              L'administration examine et valide la clarté du document avant de l'indexer dans la bibliothèque numérique.
            </p>
          </div>
        </div>
      </section>

      {/* Form or success screen */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10" id="contribution-form-card">
        {showSubmissionSuccess ? (
          <div className="text-center py-8 space-y-6 max-w-lg mx-auto animate-in fade-in zoom-in-95 duration-300">
            <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto shadow-inner">
              <CheckCircle2 className="h-10 w-10" />
            </div>
            <div className="space-y-2">
              <h3 className="font-serif text-2xl font-bold text-gray-900">Document envoyé avec succès !</h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                Merci <strong>{successDetails?.nom}</strong> pour votre générosité. Le document <strong>"{successDetails?.nomDoc}"</strong> a été transmis en toute sécurité pour modération.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowSubmissionSuccess(false)}
              className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all cursor-pointer"
            >
              Faire un nouveau dépôt de document
            </button>
          </div>
        ) : (
          <>
            <div className="pb-6 mb-6 border-b border-gray-100">
              <h2 className="font-serif text-2xl font-bold text-gray-900 flex items-center gap-2">
                <span>📁 Formulaire de dépôt de document</span>
              </h2>
              <p className="text-xs text-gray-400 mt-1">
                Tous les champs marqués d'une astérisque (*) sont obligatoires. Vos informations restent confidentielles et ne servent qu'à la modération académique.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              
              {/* Section 1 : Informations sur le déposant */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-brand uppercase tracking-widest border-l-2 border-brand pl-2.5">
                  1. Informations sur le contributeur
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Votre Nom Complet *</label>
                    <input
                      type="text"
                      name="nom"
                      required
                      placeholder="Ex : Kaboré Wend-Panga"
                      value={formData.nom}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Votre Adresse E-mail Institutionnelle *</label>
                    <input
                      type="email"
                      name="email"
                      required
                      placeholder="Ex : prenom.nom@2ie-edu.org"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Votre Statut universitaire *</label>
                    <select
                      name="statut"
                      required
                      value={formData.statut}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none"
                    >
                      <option value="Etudiant">Étudiant</option>
                      <option value="Alumni">Alumni</option>
                      <option value="Professeur">Professeur</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Section 2 : Métadonnées du document */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-brand uppercase tracking-widest border-l-2 border-brand pl-2.5">
                  2. Identification du document pédagogique
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Filière concernée *</label>
                    <select
                      name="filiere"
                      required
                      value={formData.filiere}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none"
                    >
                      <option value="">Sélectionnez la filière</option>
                      <option value="tc">Tronc Commun (Bachelor S1 à S4)</option>
                      <option value="gee">GEE (Électricité & Énergies)</option>
                      <option value="gc-btp">GC-BTP (Génie Civil & BTP)</option>
                      <option value="geaah">GEAAH (Eau, Assainissement & AH)</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Semestre académique *</label>
                    <select
                      name="semestre"
                      required
                      disabled={!formData.filiere}
                      value={formData.semestre}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="">{formData.filiere ? "Sélectionnez le semestre" : "Choisissez la filière d'abord"}</option>
                      {semesters.map(sem => (
                        <option key={sem} value={sem}>{sem}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Type de support *</label>
                    <select
                      name="typeDoc"
                      required
                      value={formData.typeDoc}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none"
                    >
                      <option value="Cours">Support de Cours (Syllabus / PPT)</option>
                      <option value="TD">Travaux Dirigés (TD / Corrigé)</option>
                      <option value="TP">Travaux Pratiques (TP / Rapport)</option>
                      <option value="Examen">Sujet d'Examen / Devoir</option>
                      <option value="Rapport_PFE">Rapport de Stage / Mémoire PFE</option>
                      <option value="Fiche_Lecture">Fiche de Synthèse / Lecture</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Nom de la Matière / UE *</label>
                    <input
                      type="text"
                      name="matiere"
                      required
                      placeholder="Ex : Résistance des Matériaux (RDM)"
                      value={formData.matiere}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="md:col-span-2 space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">Titre précis du document *</label>
                    <input
                      type="text"
                      name="nomDoc"
                      required
                      placeholder="Ex : TD 1 Corrigé - Calcul de structures isostatiques"
                      value={formData.nomDoc}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-xs font-bold text-gray-700">
                      Syllabus / Enseignant <span className="text-gray-400 font-normal">(Optionnel)</span>
                    </label>
                    <input
                      type="text"
                      name="commentaire"
                      placeholder="Ex : Cours dispensé par M. Jean-Marc Touré"
                      value={formData.commentaire}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* Section 3 : Drag & Drop Zone */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-brand uppercase tracking-widest border-l-2 border-brand pl-2.5">
                  3. Téléversement du document (PDF uniquement)
                </h4>
                
                <div 
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                  onClick={triggerFileSelect}
                  className={`border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center transition-all cursor-pointer flex flex-col items-center justify-center space-y-4 ${
                    dragActive 
                      ? 'border-brand bg-brand/5 scale-[1.01]' 
                      : selectedFile 
                      ? 'border-emerald-300 bg-emerald-50/20' 
                      : 'border-gray-200 hover:border-gray-300 bg-gray-50/50 hover:bg-gray-50'
                  }`}
                >
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />

                  {selectedFile ? (
                    <>
                      <div className="w-14 h-14 bg-emerald-50 text-emerald-500 rounded-2xl flex items-center justify-center shadow-inner">
                        <CheckCircle className="h-8 w-8" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-serif text-sm sm:text-base font-bold text-gray-900 select-all max-w-lg truncate">
                          {selectedFile.name}
                        </h4>
                        <p className="text-xs text-gray-400">
                          Taille du fichier : <strong>{(selectedFile.size / (1024 * 1024)).toFixed(2)} Mo</strong> · Format PDF validé ✓
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedFile(null);
                          setBase64Data('');
                        }}
                        className="px-3.5 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-100 rounded-lg text-[10px] font-bold transition-all cursor-pointer"
                      >
                        Retirer le fichier
                      </button>
                    </>
                  ) : (
                    <>
                      <div className="w-14 h-14 bg-brand/5 text-brand rounded-2xl flex items-center justify-center shadow-inner">
                        <Upload className="h-7 w-7" />
                      </div>
                      <div className="space-y-1">
                        <h4 className="font-serif text-sm sm:text-base font-bold text-gray-900">
                          Glissez-déposez votre document PDF ici
                        </h4>
                        <p className="text-xs text-gray-500">
                          ou <span className="text-brand font-semibold hover:underline">parcourez vos fichiers</span> depuis votre appareil
                        </p>
                      </div>
                      <p className="text-[10px] text-gray-400 max-w-xs leading-normal">
                        Seuls les fichiers au format <strong>PDF</strong> de moins de <strong>15 Mo</strong> sont acceptés par la plateforme d'intégration d'archiv2ie.
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Submit button */}
              <div className="pt-4 border-t border-gray-100 flex justify-end">
                <button
                  type="submit"
                  disabled={isSubmitting || !selectedFile}
                  className="px-8 py-3.5 bg-gray-900 hover:bg-black text-white font-bold rounded-xl text-xs sm:text-sm shadow-md hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2 transform active:scale-[0.99]"
                >
                  {isSubmitting && <RefreshCw className="h-4 w-4 animate-spin text-white" />}
                  <span>Soumettre le document 📤</span>
                </button>
              </div>

            </form>
          </>
        )}
      </section>

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

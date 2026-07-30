import React, { useState, useEffect } from 'react';
import { 
  Copy,
  Check,
  MessageCircle,
  Send,
  Sparkles,
  Info,
  HelpCircle,
  AlertTriangle,
  CheckCircle,
  ArrowUpRight,
  Users,
  ExternalLink
} from 'lucide-react';
import { Page } from '../types';

// Numéros et identifiants de contact par défaut pour la contribution
const WHATSAPP_NUMBER = '2250564749915'; // Numéro officiel WhatsApp archiv2ie
const WHATSAPP_COMMUNITY_URL = 'https://chat.whatsapp.com/archiv2ie'; // Lien Groupe / Chaîne officiel WhatsApp
const TELEGRAM_USERNAME = 'archiv2ie'; // Bot/Compte officiel Telegram
const TELEGRAM_CHANNEL_URL = 'https://t.me/archiv2ie'; // Canal / Groupe officiel Telegram

interface ContribuerProps {
  setCurrentPage?: (page: Page) => void;
}

export default function Contribuer({ setCurrentPage }: ContribuerProps) {
  // Champs optionnels pour personnaliser le message WhatsApp / Telegram
  const [formData, setFormData] = useState({
    nom: '',
    filiere: '',
    semestre: '',
    matiere: '',
    typeDoc: 'Cours',
    nomDoc: '',
    commentaire: ''
  });

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Label helpers for filiere names
  const getFiliereLabel = (code: string) => {
    switch (code) {
      case 'tc': return 'Tronc Commun (S1 à S4)';
      case 'gee': return 'Génie Électrique & Énergétique (GEE)';
      case 'gc-btp': return 'Génie Civil & BTP (GC-BTP)';
      case 'geaah': return 'Génie Eau, Assainissement & AH (GEAAH)';
      default: return code || 'Non spécifiée';
    }
  };

  const getSemestersForFiliere = (filiere: string) => {
    switch (filiere) {
      case 'tc':
        return ['S1', 'S2', 'S3', 'S4'];
      case 'gee':
      case 'gc-btp':
      case 'geaah':
        return ['S5', 'S6', 'S7', 'S8', 'S9', 'S10'];
      default:
        return ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8', 'S9', 'S10'];
    }
  };

  // Generate constructed text message
  const buildTextMessage = () => {
    let msg = `Bonjour l'équipe archiv2ie ! 📚\n`;
    msg += `Je souhaite contribuer en envoyant un document académique pour la bibliothèque numérique :\n\n`;

    if (formData.nom.trim()) {
      msg += `👤 Nom / Contributeur : ${formData.nom.trim()}\n`;
    }
    if (formData.filiere) {
      msg += `🎓 Filière : ${getFiliereLabel(formData.filiere)}\n`;
    }
    if (formData.semestre) {
      msg += `📅 Semestre : ${formData.semestre}\n`;
    }
    if (formData.matiere.trim()) {
      msg += `📖 Matière / UE : ${formData.matiere.trim()}\n`;
    }
    if (formData.typeDoc) {
      msg += `📑 Type de document : ${formData.typeDoc}\n`;
    }
    if (formData.nomDoc.trim()) {
      msg += `📌 Titre du document : ${formData.nomDoc.trim()}\n`;
    }
    if (formData.commentaire.trim()) {
      msg += `💬 Note / Enseignant : ${formData.commentaire.trim()}\n`;
    }

    msg += `\n(Je vous joins le fichier PDF / document ci-dessous)`;
    return msg;
  };

  const formattedText = buildTextMessage();

  // WhatsApp Link
  const getWhatsAppUrl = () => {
    const encoded = encodeURIComponent(formattedText);
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
  };

  // Telegram Link
  const getTelegramUrl = () => {
    const encoded = encodeURIComponent(formattedText);
    return `https://t.me/${TELEGRAM_USERNAME}?text=${encoded}`;
  };

  const handleCopyText = (key: string) => {
    navigator.clipboard.writeText(formattedText);
    setCopiedKey(key);
    showToast("Message copié dans le presse-papier ! Vous pouvez le coller directement dans votre application.", "success");
    setTimeout(() => {
      setCopiedKey(null);
    }, 3000);
  };

  const semesters = getSemestersForFiliere(formData.filiere);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header and page Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-gray-100">
        <div className="space-y-3 max-w-4xl">
          <h1 
            className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight flex items-center gap-3"
          >
            <span>Contribuer au Projet</span>
          </h1>
          <p className="text-sm sm:text-base text-gray-500 leading-relaxed">
            Vous détenez des supports de cours de qualité, des examens corrigés, ou un rapport d'excellence ? Rejoignez l'effort d'archivage d'<strong>archiv2ie</strong>. Envoyez vos documents directement via <strong>WhatsApp</strong> ou <strong>Telegram</strong> en 1 clic !
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-r from-brand/5 via-brand/5 to-transparent border-l-4 border-brand p-6 rounded-r-2xl">
        <p className="font-sans text-gray-700 text-base sm:text-lg italic leading-relaxed">
          "archiv2ie existe et prospère grâce à ceux qui donnent autant qu'ils reçoivent."
        </p>
      </div>

      {/* Guide Protocol in 3 steps */}
      <section className="space-y-6">
        <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">Comment procéder en 3 étapes simples</h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold font-serif text-lg">
              1
            </div>
            <strong className="block font-serif text-base text-gray-900">Cliquez</strong>
            <p className="text-xs text-gray-500 leading-relaxed">
              Sélectionnez WhatsApp ou Telegram. Votre application s'ouvrira immédiatement avec le message pré-rempli.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold font-serif text-lg">
              2
            </div>
            <strong className="block font-serif text-base text-gray-900">Joignez le fichier</strong>
            <p className="text-xs text-gray-500 leading-relaxed">
              Attachez votre fichier PDF, Word ou vos photos lisibles dans la discussion.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold font-serif text-lg">
              3
            </div>
            <strong className="block font-serif text-base text-gray-900">Validation</strong>
            <p className="text-xs text-gray-500 leading-relaxed">
              L'équipe modératrice archiv2ie vérifie la lisibilité et publie le document dans la bibliothèque publique.
            </p>
          </div>
        </div>
      </section>

      {/* Optional Interactive Helper: Pre-fill Document Info */}
      <section className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 sm:p-10 space-y-6">
        <div className="pb-4 border-b border-gray-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>✍️ Personnaliser les détails de votre message</span>
            </h3>
            <p className="text-xs text-gray-500 mt-0.5">
              Si vous le souhaitez, précisez la filière et la matière ci-dessous. Le texte du message à envoyer dans WhatsApp ou Telegram sera automatiquement mis à jour.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">Votre Nom / Pseudo</label>
            <input
              type="text"
              name="nom"
              placeholder="Ex : Kaboré Marc"
              value={formData.nom}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">Filière concernée</label>
            <select
              name="filiere"
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
            <label className="block text-xs font-bold text-gray-700">Semestre académique</label>
            <select
              name="semestre"
              value={formData.semestre}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none"
            >
              <option value="">Sélectionnez le semestre</option>
              {semesters.map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">Type de support</label>
            <select
              name="typeDoc"
              value={formData.typeDoc}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none"
            >
              <option value="Cours">Support de Cours</option>
              <option value="TD">Travaux Dirigés (TD / Corrigé)</option>
              <option value="TP">Travaux Pratiques (TP / Rapport)</option>
              <option value="Examen">Sujet d'Examen / Devoir</option>
              <option value="Rapport_PFE">Rapport de Stage / Mémoire PFE</option>
              <option value="Fiche_Lecture">Fiche de Synthèse / Lecture</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">Matière / UE</label>
            <input
              type="text"
              name="matiere"
              placeholder="Ex : Résistance des Matériaux (RDM)"
              value={formData.matiere}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-gray-700">Titre précis du document</label>
            <input
              type="text"
              name="nomDoc"
              placeholder="Ex : Chapitre 1 - Calcul de structures"
              value={formData.nomDoc}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-gray-50 focus:bg-white border border-gray-200 focus:border-brand focus:ring-2 focus:ring-brand/10 rounded-xl text-xs transition-all outline-none"
            />
          </div>
        </div>

        {/* Live Message Preview Box */}
        <div className="bg-gray-50 rounded-2xl p-4 border border-gray-200/80 space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-gray-600">
            <span className="flex items-center gap-1.5">
              <Info className="h-4 w-4 text-brand" />
              Aperçu dynamique du message :
            </span>
            <button
              type="button"
              onClick={() => handleCopyText('preview')}
              className="text-brand hover:underline font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
            >
              <Copy className="h-3 w-3" />
              Copier
            </button>
          </div>
          <pre className="text-xs text-gray-800 font-mono whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-xl border border-gray-200/60 select-all">
            {formattedText}
          </pre>
        </div>
      </section>

      {/* Main Direct Redirection Section (WhatsApp & Telegram Buttons) */}
      <section className="space-y-8" id="instant-contribution-section">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-gray-900">
            Choisissez votre application préférée pour envoyer le document
          </h2>
          <p className="text-xs sm:text-sm text-gray-500">
            Cliquez directement sur l'un des boutons ci-dessous. Le contact s'ouvrira immédiatement dans votre application WhatsApp ou Telegram avec votre message prêt à l'envoi, ou rejoignez notre groupe / chaîne officielle.
          </p>
        </div>

        {/* Primary Action Cards: WhatsApp & Telegram */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          
          {/* WhatsApp Card */}
          <div className="bg-gradient-to-b from-emerald-500/5 via-white to-white rounded-3xl p-6 sm:p-8 border-2 border-emerald-500/30 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <MessageCircle className="h-8 w-8 fill-current" />
                </div>
                <span className="px-3 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Recommandé ⚡
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>Envoyer via WhatsApp</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Discutez directement avec le responsable d'archivage 2iE sur WhatsApp. Vous pourrez lui envoyer votre PDF, vos clichés de cours ou votre document Word.
                </p>
              </div>

              <div className="bg-emerald-50/60 p-3.5 rounded-xl border border-emerald-100 text-xs text-emerald-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-emerald-600" />
                  <span>Réponse & Validation rapide</span>
                </p>
                <p className="text-[11px] opacity-80 pl-5">
                  Idéal sur mobile ou WhatsApp Web. Aucune inscription requise !
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={getWhatsAppUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#25D366] hover:bg-[#20bd5a] text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <MessageCircle className="h-5 w-5 fill-current" />
                <span>Ouvrir WhatsApp (Envoi direct)</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <a
                href={WHATSAPP_COMMUNITY_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold rounded-xl text-xs border border-emerald-200/80 transition-all cursor-pointer"
              >
                <Users className="h-4 w-4 text-emerald-600" />
                <span>Rejoindre le Groupe / Chaîne WhatsApp 👥</span>
                <ExternalLink className="h-3.5 w-3.5 text-emerald-600 opacity-80" />
              </a>

              <button
                type="button"
                onClick={() => handleCopyText('whatsapp')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs border border-gray-200 transition-all cursor-pointer"
              >
                {copiedKey === 'whatsapp' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-emerald-600" />
                    <span className="text-emerald-700">Message copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-gray-500" />
                    <span>Copier le texte du message</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Telegram Card */}
          <div className="bg-gradient-to-b from-sky-500/5 via-white to-white rounded-3xl p-6 sm:p-8 border-2 border-sky-500/30 shadow-md hover:shadow-xl transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#229ED9] text-white flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
                  <Send className="h-7 w-7 transform -translate-x-0.5" />
                </div>
                <span className="px-3 py-1 bg-sky-100 text-sky-800 text-[10px] font-bold rounded-full uppercase tracking-wider">
                  Haute Qualité 🚀
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <span>Envoyer via Telegram</span>
                </h3>
                <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                  Transmettez vos documents volumineux sans aucune compression de qualité via Telegram directement à l'équipe archiv2ie.
                </p>
              </div>

              <div className="bg-sky-50/60 p-3.5 rounded-xl border border-sky-100 text-xs text-sky-900 space-y-1">
                <p className="font-bold flex items-center gap-1.5">
                  <CheckCircle className="h-4 w-4 text-sky-600" />
                  <span>Supporte les gros fichiers (jusqu'à 2 Go)</span>
                </p>
                <p className="text-[11px] opacity-80 pl-5">
                  Parfait pour les séries de vidéos, plusieurs PDF combinés ou archives.
                </p>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <a
                href={getTelegramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#229ED9] hover:bg-[#1f8ec4] text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <Send className="h-5 w-5" />
                <span>Ouvrir Telegram (Envoi direct)</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>

              <a
                href={TELEGRAM_CHANNEL_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 bg-sky-50 hover:bg-sky-100 text-sky-800 font-bold rounded-xl text-xs border border-sky-200/80 transition-all cursor-pointer"
              >
                <Users className="h-4 w-4 text-sky-600" />
                <span>Rejoindre la Chaîne / Groupe Telegram 📢</span>
                <ExternalLink className="h-3.5 w-3.5 text-sky-600 opacity-80" />
              </a>

              <button
                type="button"
                onClick={() => handleCopyText('telegram')}
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold rounded-xl text-xs border border-gray-200 transition-all cursor-pointer"
              >
                {copiedKey === 'telegram' ? (
                  <>
                    <Check className="h-3.5 w-3.5 text-sky-600" />
                    <span className="text-sky-700">Message copié !</span>
                  </>
                ) : (
                  <>
                    <Copy className="h-3.5 w-3.5 text-gray-500" />
                    <span>Copier le texte du message</span>
                  </>
                )}
              </button>
            </div>
          </div>

        </div>

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

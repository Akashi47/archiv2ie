import React, { useState } from 'react';
import { 
  Send, 
  MessageCircle, 
  Info, 
  CheckCircle, 
  AlertTriangle, 
  HelpCircle, 
  ExternalLink,
  ArrowUpRight,
  Sparkles,
  Heart,
  FileCheck,
  UploadCloud,
  Check,
  UserCheck
} from 'lucide-react';

const WHATSAPP_NUMBER = "2250564749915";
const TELEGRAM_USERNAME = "eyuaelie";

interface FormData {
  nom: string;
  filiere: string;
  semestre: string;
  matiere: string;
  typeDoc: string;
  nomDoc: string;
  commentaires: string;
}

export default function Contribuer() {
  const [formData, setFormData] = useState<FormData>({
    nom: '',
    filiere: '',
    semestre: '',
    matiere: '',
    typeDoc: 'Cours',
    nomDoc: '',
    commentaires: ''
  });

  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 4500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const getSemestersForFiliere = (filiere: string) => {
    switch (filiere) {
      case 'tc':
        return ['S1', 'S2', 'S3', 'S4'];
      case 'gee':
      case 'gc-btp':
      case 'geaah':
        return ['S5D', 'S5S', 'S6D', 'S6S', 'S7', 'S8', 'S9'];
      default:
        return ['S1', 'S2', 'S3', 'S4', 'S5D', 'S5S', 'S6D', 'S6S', 'S7', 'S8', 'S9'];
    }
  };

  // Generate standardized contribution message
  const generateFormattedMessage = () => {
    const nom = formData.nom.trim() || "Étudiant(e) 2iE";
    const filiere = formData.filiere ? formData.filiere.toUpperCase() : "Non précisée";
    const semestre = formData.semestre || "Non précisé";
    const typeDoc = formData.typeDoc || "Support de cours / Examen";
    const matiere = formData.matiere.trim() || "Non précisée";
    const nomDoc = formData.nomDoc.trim() || "Document sans titre";
    const commentaires = formData.commentaires.trim() ? `\n💬 Note complémentaire : ${formData.commentaires.trim()}` : "";

    return `📚 [CONTRIBUTION ARCHIV2IE]
👤 Contributeur : ${nom}
🎓 Filière : ${filiere}
🗓️ Semestre : ${semestre}
📁 Type : ${typeDoc}
📖 Matière : ${matiere}
📄 Titre du document : ${nomDoc}${commentaires}

(Je joins mon fichier / mes photos ci-dessous dans la discussion 👇)`;
  };

  const formattedText = generateFormattedMessage();

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

  const semesters = getSemestersForFiliere(formData.filiere);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
      
      {/* Header and page Title */}
      <div className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight">
          Contribuer au projet
        </h1>
        
        <div className="human-note p-6 sm:p-8 rounded-2xl sm:rounded-3xl space-y-2">
          <p className="font-sans text-[#334155] text-base sm:text-lg italic leading-relaxed">
            "archiv2ie existe et prospère grâce à ceux qui donnent autant qu'ils reçoivent. Vous possédez un polycopié, un devoir corrigé ou un mémoire validé ? Envoyez-le en 1 clic !"
          </p>
        </div>
      </div>

      {/* Guide Protocol in 3 steps */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">Processus simple</span>
          <h3 className="font-serif text-2xl font-bold text-[#0F172A]">Comment procéder en 3 étapes</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div className="human-card p-6 rounded-2xl text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-[#EAF5EE] text-[#1B835E] flex items-center justify-center font-bold font-serif text-base border border-[#1B835E]/20">
              1
            </div>
            <strong className="block font-serif text-base text-[#0F172A]">Cliquez</strong>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Sélectionnez WhatsApp ou Telegram. Votre application s'ouvrira immédiatement avec le message pré-rempli.
            </p>
          </div>

          <div className="human-card p-6 rounded-2xl text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-[#FDF0D9] text-gc flex items-center justify-center font-bold font-serif text-base border border-[#C2820C]/20">
              2
            </div>
            <strong className="block font-serif text-base text-[#0F172A]">Joignez le fichier</strong>
            <p className="text-xs text-[#64748B] leading-relaxed">
              Attachez votre document (PDF, Word, photos lisibles) dans la discussion ouverte.
            </p>
          </div>

          <div className="human-card p-6 rounded-2xl text-center space-y-2">
            <div className="mx-auto w-10 h-10 rounded-2xl bg-[#E1EEF9] text-geaah flex items-center justify-center font-bold font-serif text-base border border-[#1B588C]/20">
              3
            </div>
            <strong className="block font-serif text-base text-[#0F172A]">Publication</strong>
            <p className="text-xs text-[#64748B] leading-relaxed">
              La modération étudiante classe le document dans le bon dossier Drive public.
            </p>
          </div>
        </div>
      </section>

      {/* Optional Interactive Helper: Pre-fill Document Info */}
      <section className="bg-white rounded-3xl border border-[#E2E8F0] shadow-[0_4px_24px_rgba(40,30,20,0.03)] p-6 sm:p-10 space-y-6">
        <div className="pb-4 border-b border-[#E2E8F0] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-serif text-lg font-bold text-[#0F172A] flex items-center gap-2">
              <span>✍️ Personnaliser les détails de votre message (Optionnel)</span>
            </h3>
            <p className="text-xs text-[#64748B] mt-0.5">
              Précisez la filière et la matière ci-dessous. Le texte du message à envoyer dans WhatsApp ou Telegram sera automatiquement mis à jour.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#334155]">Votre Nom / Pseudo</label>
            <input
              type="text"
              name="nom"
              placeholder="Ex : Kaboré Marc"
              value={formData.nom}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-brand focus:ring-2 focus:ring-brand/15 rounded-xl text-xs transition-all outline-none text-[#0F172A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#334155]">Filière concernée</label>
            <select
              name="filiere"
              value={formData.filiere}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-brand focus:ring-2 focus:ring-brand/15 rounded-xl text-xs transition-all outline-none text-[#0F172A]"
            >
              <option value="">Sélectionnez la filière</option>
              <option value="tc">Tronc Commun (Bachelor S1 à S4)</option>
              <option value="gee">GEE (Électricité & Énergies)</option>
              <option value="gc-btp">GC-BTP (Génie Civil & BTP)</option>
              <option value="geaah">GEAAH (Eau, Assainissement & AH)</option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#334155]">Semestre académique</label>
            <select
              name="semestre"
              value={formData.semestre}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-brand focus:ring-2 focus:ring-brand/15 rounded-xl text-xs transition-all outline-none text-[#0F172A]"
            >
              <option value="">Sélectionnez le semestre</option>
              {semesters.map(sem => (
                <option key={sem} value={sem}>{sem}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#334155]">Type de support</label>
            <select
              name="typeDoc"
              value={formData.typeDoc}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-brand focus:ring-2 focus:ring-brand/15 rounded-xl text-xs transition-all outline-none text-[#0F172A]"
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
            <label className="block text-xs font-bold text-[#334155]">Matière / UE</label>
            <input
              type="text"
              name="matiere"
              placeholder="Ex : Résistance des Matériaux (RDM)"
              value={formData.matiere}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-brand focus:ring-2 focus:ring-brand/15 rounded-xl text-xs transition-all outline-none text-[#0F172A]"
            />
          </div>

          <div className="space-y-1.5">
            <label className="block text-xs font-bold text-[#334155]">Titre précis du document</label>
            <input
              type="text"
              name="nomDoc"
              placeholder="Ex : Chapitre 1 - Calcul de structures"
              value={formData.nomDoc}
              onChange={handleInputChange}
              className="w-full px-4 py-2.5 bg-[#F8FAFC] focus:bg-white border border-[#E2E8F0] focus:border-brand focus:ring-2 focus:ring-brand/15 rounded-xl text-xs transition-all outline-none text-[#0F172A]"
            />
          </div>
        </div>

        {/* Live Message Preview Box */}
        <div className="bg-[#F8FAFC] rounded-2xl p-4 border border-[#E2E8F0] space-y-2">
          <div className="flex items-center justify-between text-xs font-bold text-[#64748B]">
            <span className="flex items-center gap-1.5">
              <Info className="h-4 w-4 text-brand" />
              Aperçu dynamique du message envoyé :
            </span>
          </div>
          <pre className="text-xs text-[#0F172A] font-mono whitespace-pre-wrap leading-relaxed bg-white p-3 rounded-xl border border-[#E2E8F0] select-all">
            {formattedText}
          </pre>
        </div>
      </section>

      {/* Main Direct Redirection Section (WhatsApp & Telegram Buttons) */}
      <section className="space-y-8" id="instant-contribution-section">
        
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">Canaux directs</span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F172A]">
            Choisissez votre application d'envoi
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B]">
            Cliquez directement sur l'un des boutons ci-dessous pour transmettre votre document.
          </p>
        </div>

        {/* Primary Action Cards: WhatsApp & Telegram */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 max-w-4xl mx-auto">
          
          {/* WhatsApp Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#25D366] text-white flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform">
                  <MessageCircle className="h-8 w-8 fill-current" />
                </div>
                <span className="px-3 py-1 bg-[#EAF5EE] text-[#1B835E] text-[10px] font-bold rounded-full uppercase tracking-wider border border-[#1B835E]/20">
                  Instantané ⚡
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A]">
                  Envoyer via WhatsApp
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Discutez directement avec le responsable d'archivage 2iE sur WhatsApp pour transmettre vos fichiers en toute simplicité.
                </p>
              </div>

              <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0] text-xs text-[#334155] space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-[#1B835E]">
                  <CheckCircle className="h-4 w-4" />
                  <span>Validation & intégration rapides</span>
                </p>
                <p className="text-[11px] text-[#64748B] pl-5">
                  Idéal sur mobile ou WhatsApp Web. Aucune inscription requise !
                </p>
              </div>
            </div>

            <div className="pt-2">
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
            </div>
          </div>

          {/* Telegram Card */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E2E8F0] shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-6 group">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-14 h-14 rounded-2xl bg-[#229ED9] text-white flex items-center justify-center shadow-lg shadow-sky-500/20 group-hover:scale-105 transition-transform">
                  <Send className="h-7 w-7 transform -translate-x-0.5" />
                </div>
                <span className="px-3 py-1 bg-[#E1EEF9] text-geaah text-[10px] font-bold rounded-full uppercase tracking-wider border border-[#1B588C]/20">
                  Gros volumes 🚀
                </span>
              </div>

              <div className="space-y-2">
                <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A]">
                  Envoyer via Telegram
                </h3>
                <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
                  Transmettez vos documents volumineux ou séries de fichiers sans compression via Telegram à <strong className="text-[#0F172A]">@eyuaelie</strong>.
                </p>
              </div>

              <div className="bg-[#F8FAFC] p-3.5 rounded-2xl border border-[#E2E8F0] text-xs text-[#334155] space-y-1">
                <p className="font-bold flex items-center gap-1.5 text-geaah">
                  <CheckCircle className="h-4 w-4" />
                  <span>Supporte les gros fichiers (jusqu'à 2 Go)</span>
                </p>
                <p className="text-[11px] text-[#64748B] pl-5">
                  Parfait pour les séries de TP, archives ZIP ou vidéos techniques.
                </p>
              </div>
            </div>

            <div className="pt-2">
              <a
                href={getTelegramUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3.5 bg-[#229ED9] hover:bg-[#1f8ec4] text-white font-bold rounded-2xl text-sm shadow-md hover:shadow-lg transition-all active:scale-[0.98] cursor-pointer"
              >
                <Send className="h-5 w-5" />
                <span>Ouvrir Telegram (@eyuaelie)</span>
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </div>

        </div>

      </section>

      {/* Toast Notification System */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] max-w-sm transition-all duration-300 transform translate-y-0 opacity-100 shadow-2xl">
          <div className={`p-4 rounded-2xl flex items-start gap-3 border ${
            toast.type === 'success' 
              ? 'bg-[#EAF5EE] text-[#1B835E] border-[#1B835E]/20 shadow-emerald-900/10' 
              : toast.type === 'error'
              ? 'bg-[#FCE8E6] text-gee border-gee/20 shadow-red-900/10' 
              : 'bg-[#F1F5F9] text-gc border-gc/20 shadow-amber-900/10'
          }`}>
            <div className="mt-0.5 flex-shrink-0">
              {toast.type === 'success' ? (
                <CheckCircle className="h-5 w-5 text-[#1B835E]" />
              ) : toast.type === 'error' ? (
                <AlertTriangle className="h-5 w-5 text-gee" />
              ) : (
                <HelpCircle className="h-5 w-5 text-gc" />
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
              className="text-[#94A3B8] hover:text-[#0F172A] font-bold text-xs flex-shrink-0 cursor-pointer px-1"
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

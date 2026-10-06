import React, { useState } from 'react';
import { 
  Target, 
  MessageSquare, 
  Award, 
  Sparkles, 
  ShieldCheck, 
  Send, 
  CheckCircle2, 
  FileQuestion, 
  Lightbulb, 
  Compass,
  Check,
  MessageCircle,
  ExternalLink
} from 'lucide-react';

const WHATSAPP_NUMBER = "2250564749915";

export default function About() {
  const [activeTab, setActiveTab] = useState<'signalement' | 'suggestion'>('signalement');
  const [submitted, setSubmitted] = useState(false);
  const [lastWhatsAppUrl, setLastWhatsAppUrl] = useState('');
  const [formData, setFormData] = useState({
    filiere: 'Tronc Commun (S1-S4)',
    documentName: '',
    semestre: 'S1',
    suggestionType: 'ergonomie',
    message: ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.documentName && activeTab === 'signalement') return;
    if (!formData.message && activeTab === 'suggestion') return;

    let textMessage = '';
    if (activeTab === 'signalement') {
      textMessage = `📢 *[SIGNALEMENT DOCUMENT MANQUANT - ARCHIV2IE]*
🎓 *Filière :* ${formData.filiere}
🗓️ *Semestre :* ${formData.semestre}
📄 *Document recherché :* ${formData.documentName.trim()}

Bonjour, je recherche ce support de cours / d'examen sur archiv2ie !`;
    } else {
      const typeLabel = 
        formData.suggestionType === 'ergonomie' ? 'Ergonomie & Navigation' :
        formData.suggestionType === 'nouvelle-rubrique' ? 'Nouvelle rubrique ou matière' :
        formData.suggestionType === 'drive' ? 'Lien Drive ou téléchargement' : 'Autre idée créative';

      textMessage = `💡 *[SUGGESTION D'AMÉLIORATION - ARCHIV2IE]*
🎯 *Catégorie :* ${typeLabel}
💬 *Proposition :* ${formData.message.trim()}

Bonjour, voici une suggestion pour enrichir la plateforme archiv2ie !`;
    }

    const encoded = encodeURIComponent(textMessage);
    const waUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;
    setLastWhatsAppUrl(waUrl);

    // Save to local storage
    try {
      const stored = JSON.parse(localStorage.getItem('archiv2ie_suggestions') || '[]');
      stored.push({
        id: Date.now(),
        type: activeTab,
        ...formData,
        date: new Date().toISOString()
      });
      localStorage.setItem('archiv2ie_suggestions', JSON.stringify(stored));
    } catch {
      // ignore
    }

    // Open WhatsApp directly in a new tab/window
    window.open(waUrl, '_blank', 'noopener,noreferrer');

    setSubmitted(true);
  };

  const handleReset = () => {
    setFormData({
      filiere: 'Tronc Commun (S1-S4)',
      documentName: '',
      semestre: 'S1',
      suggestionType: 'ergonomie',
      message: ''
    });
    setSubmitted(false);
    setLastWhatsAppUrl('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-12">
      
      {/* Page Title */}
      <div className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight">
          À propos d'archiv2ie
        </h1>
        
        <div className="human-note p-6 sm:p-8 rounded-2xl sm:rounded-3xl space-y-2">
          <p className="font-sans text-[#334155] text-base sm:text-lg italic leading-relaxed">
            Plateforme collaborative d'archivage numérique conçue par et pour les étudiants de l'Institut 2iE. Accédez librement aux cours, TD, examens, ainsi qu'aux rapports de stage et PFE.
          </p>
        </div>
      </div>

      {/* Grid: 3 Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-2">
        
        {/* Our Mission */}
        <div className="human-card p-6 sm:p-8 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#EAF5EE] text-[#1B835E] flex items-center justify-center font-bold text-xl flex-shrink-0">
                🎯
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0F172A]">Notre mission</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Centraliser, pérenniser et démocratiser l'accès aux supports documentaires indispensables de l'étudiant. Que vous soyez en Tronc Commun ou en phase de spécialisation poussée (GEE, GC-BTP, GEAAH), archiv2ie vous fournit les armes nécessaires pour appréhender sereinement vos contrôles et projets.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-[#1B835E] flex items-center gap-1.5">
            <span>Transmission de promo en promo</span>
          </div>
        </div>

        {/* How to Contribute */}
        <div className="human-card p-6 sm:p-8 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#FEF8ED] text-gc flex items-center justify-center font-bold text-xl flex-shrink-0">
                🤝
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0F172A]">Comment contribuer ?</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              La plateforme vit uniquement grâce aux transferts de connaissances intergénérationnels. En partageant vos sujets d'examen récents ou vos rapports validés, vous facilitez le parcours académique des promotions suivantes. La réussite au sein de l'institut est un projet solidaire et collectif.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-gc flex items-center gap-1.5">
            <span>100% collaboratif & bénévole</span>
          </div>
        </div>

        {/* Cadre pédagogique */}
        <div className="human-card p-6 sm:p-8 rounded-2xl space-y-4 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-2xl bg-[#F0F6FC] text-geaah flex items-center justify-center font-bold text-xl flex-shrink-0">
                <ShieldCheck className="h-6 w-6 text-geaah" />
              </div>
              <h3 className="font-serif text-xl font-bold text-[#0F172A]">Cadre pédagogique</h3>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Plateforme indépendante à vocation strictement pédagogique et non lucrative. Les supports partagés demeurent la propriété intellectuelle de leurs enseignants et auteurs respectifs et sont diffusés dans un cadre d'entraide universitaire désintéressée.
            </p>
          </div>
          <div className="pt-2 text-xs font-bold text-geaah flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Usage strictement éducatif</span>
          </div>
        </div>

      </div>

      {/* Proposition 5 : Boîte à idées & Signalement de documents manquants */}
      <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-10 shadow-sm space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-[#F1F5F9] pb-6">
          <div className="space-y-1.5">
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F172A]">
              Boîte à idées & Signalement de documents manquants
            </h2>
            <p className="text-[#64748B] text-xs sm:text-sm max-w-2xl leading-relaxed">
              Vous recherchez une annale introuvable ? Vous avez une idée pour rendre la plateforme plus rapide ou plus pratique ? Partagez vos besoins pour orienter les prochaines collectes de documents.
            </p>
          </div>

          {/* Tab Selector */}
          <div className="flex items-center bg-[#F1F5F9] p-1.5 rounded-2xl border border-[#E2E8F0] self-start md:self-auto">
            <button
              type="button"
              onClick={() => { setActiveTab('signalement'); setSubmitted(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'signalement'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <FileQuestion className="h-4 w-4 text-[#1B835E]" />
              <span>Document recherché</span>
            </button>
            <button
              type="button"
              onClick={() => { setActiveTab('suggestion'); setSubmitted(false); }}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                activeTab === 'suggestion'
                  ? 'bg-white text-[#0F172A] shadow-xs'
                  : 'text-[#64748B] hover:text-[#0F172A]'
              }`}
            >
              <Lightbulb className="h-4 w-4 text-gc" />
              <span>Idée d'amélioration</span>
            </button>
          </div>
        </div>

        {/* Content Box */}
        {submitted ? (
          <div className="bg-[#EAF5EE] border border-[#CDE8D7] rounded-2xl p-8 text-center space-y-5 animate-fade-in">
            <div className="w-12 h-12 bg-[#25D366] text-white rounded-full flex items-center justify-center mx-auto shadow-sm">
              <Check className="h-6 w-6 stroke-[3]" />
            </div>
            <div className="space-y-1.5">
              <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A]">
                Message prêt sur WhatsApp !
              </h3>
              <p className="text-xs sm:text-sm text-[#334155] max-w-lg mx-auto leading-relaxed">
                {activeTab === 'signalement'
                  ? "Votre demande de document a été formatée et WhatsApp s'est ouvert pour l'envoyer directement à l'équipe archiv2ie."
                  : "Votre suggestion a été formatée et WhatsApp s'est ouvert pour la transmettre directement."}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {lastWhatsAppUrl && (
                <a
                  href={lastWhatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold shadow-xs transition-all cursor-pointer"
                >
                  <MessageCircle className="h-4 w-4" />
                  <span>Ouvrir la discussion WhatsApp</span>
                  <ExternalLink className="h-3.5 w-3.5 opacity-80" />
                </a>
              )}
              <button
                type="button"
                onClick={handleReset}
                className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-[#F8FAFC] text-[#334155] border border-[#CBD5E1] text-xs sm:text-sm font-semibold transition-all cursor-pointer"
              >
                Autre signalement ou idée
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            {activeTab === 'signalement' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#334155] uppercase tracking-wide">
                    Filière ou Niveau
                  </label>
                  <select
                    value={formData.filiere}
                    onChange={(e) => setFormData({ ...formData, filiere: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#1B835E] transition-all"
                  >
                    <option value="Tronc Commun (S1-S4)">Tronc Commun (S1 à S4)</option>
                    <option value="GEE (Génie Électrique & Énergétique)">GEE (Électrique & Énergie)</option>
                    <option value="GC-BTP (Génie Civil & BTP)">GC-BTP (Génie Civil & BTP)</option>
                    <option value="GEAAH (Eau, Assain. & Aménag.)">GEAAH (Eau, Assain. & AH)</option>
                    <option value="Master & Doctorat">Master Spécialisé & Recherche</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#334155] uppercase tracking-wide">
                    Semestre concerné
                  </label>
                  <select
                    value={formData.semestre}
                    onChange={(e) => setFormData({ ...formData, semestre: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-[#1B835E] transition-all"
                  >
                    <option value="S1">Semestre 1</option>
                    <option value="S2">Semestre 2</option>
                    <option value="S3">Semestre 3</option>
                    <option value="S4">Semestre 4</option>
                    <option value="S5">Semestre 5 (Licence 3)</option>
                    <option value="S6">Semestre 6 (Licence 3)</option>
                    <option value="S7">Semestre 7 (Master 1)</option>
                    <option value="S8">Semestre 8 (Master 1)</option>
                    <option value="S9">Semestre 9 (Options M2)</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-1">
                  <label className="text-xs font-bold text-[#334155] uppercase tracking-wide">
                    Matière ou Document recherché
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Électronique de puissance, Examen 2023..."
                    value={formData.documentName}
                    onChange={(e) => setFormData({ ...formData, documentName: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden focus:ring-2 focus:ring-[#1B835E] transition-all"
                  />
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#334155] uppercase tracking-wide">
                    Type d'idée ou suggestion
                  </label>
                  <select
                    value={formData.suggestionType}
                    onChange={(e) => setFormData({ ...formData, suggestionType: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] focus:outline-hidden focus:ring-2 focus:ring-gc transition-all"
                  >
                    <option value="ergonomie">Ergonomie & Navigation</option>
                    <option value="nouvelle-rubrique">Nouvelle rubrique ou matière</option>
                    <option value="drive">Lien Drive ou téléchargement</option>
                    <option value="autre">Autre idée créative</option>
                  </select>
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-bold text-[#334155] uppercase tracking-wide">
                    Votre proposition en quelques mots
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ajouter un filtre par professeur ou ajouter les projets de fin d'études 2024..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-3.5 py-2.5 text-sm text-[#0F172A] placeholder-[#94A3B8] focus:outline-hidden focus:ring-2 focus:ring-gc transition-all"
                  />
                </div>
              </div>
            )}

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white text-xs sm:text-sm font-bold transition-all shadow-xs cursor-pointer active:scale-95"
              >
                <MessageCircle className="h-4 w-4" />
                <span>
                  {activeTab === 'signalement' ? 'Signaler ce document sur WhatsApp' : 'Envoyer la suggestion sur WhatsApp'}
                </span>
                <Send className="h-3.5 w-3.5 opacity-80" />
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Cheikh Anta Diop Inspiring Quote */}
      <div className="max-w-4xl mx-auto bg-white border border-[#E2E8F0] rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-sm mt-12">
        <div className="p-3 bg-[#F1F5F9] text-[#1B835E] rounded-2xl w-fit mx-auto shadow-xs border border-[#E2E8F0]">
          <Award className="h-7 w-7" />
        </div>
        
        <p className="font-serif text-xl sm:text-2xl text-[#0F172A] leading-relaxed max-w-3xl mx-auto italic font-medium">
          "Par conséquent, il n'y a qu'un seul salut, c'est la connaissance directe et aucune paresse ne pourra nous dispenser de cet effort. Formez-vous, armez-vous de Sciences jusqu'aux dents et arrachez votre patrimoine culturel."
        </p>
        
        <div className="space-y-1">
          <p className="font-bold text-brand text-base sm:text-lg">- Cheikh Anta Diop</p>
          <p className="text-[#94A3B8] text-xs uppercase tracking-wider font-semibold">
            Conférence de Niamey (Niger), 1984
          </p>
        </div>
      </div>

    </div>
  );
}


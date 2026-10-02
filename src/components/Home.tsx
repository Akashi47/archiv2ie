import React from 'react';
import { Page, FiliereKey, UserProfile } from '../types';
import { driveLinks, recentDocuments } from '../data';
import { 
  BookOpen, 
  Calendar, 
  ArrowRight, 
  Download, 
  FileText, 
  Library, 
  HelpCircle, 
  HardHat, 
  Zap, 
  Droplet, 
  Award, 
  ChevronRight, 
  Heart, 
  Users, 
  Sparkles, 
  Compass,
  ExternalLink,
  GraduationCap,
  History
} from 'lucide-react';
import graduatesImg from '../assets/images/remise-diplomes-2ie.jpg';
import { recordDocumentView } from '../firebase';

interface HomeProps {
  setCurrentPage: (page: Page) => void;
  setSelectedFiliere: (filiere: FiliereKey) => void;
}

export default function Home({ 
  setCurrentPage, 
  setSelectedFiliere
}: HomeProps) {
  
  const handleFiliereClick = (key: FiliereKey) => {
    setSelectedFiliere(key);
    setCurrentPage('filieres');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePageClick = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openDriveFolder = (key: string) => {
    const link = driveLinks[key] || driveLinks.default;
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      alert("📂 Le dossier Drive demandé est en cours de centralisation.\nIl sera disponible très prochainement !");
    }
  };

  return (
    <div className="space-y-16 pb-20">
      
      {/* Hero Banner Section */}
      <div className="relative w-full min-h-[500px] lg:min-h-[560px] flex items-center justify-center text-center overflow-hidden bg-[#1E1A17] px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Background Image with warm, vibrant framing */}
        <div className="absolute inset-0 z-0">
          <img 
            src={graduatesImg} 
            alt="Promotion 2iE" 
            className="w-full h-full object-cover object-center opacity-95 transition-transform duration-700 hover:scale-105"
            referrerPolicy="no-referrer"
          />
          {/* Warm cinematic gradient for legibility without darkening student smiles */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1613]/90 via-[#1A1613]/40 to-[#1A1613]/20" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-6 bg-[#1E1A17]/80 backdrop-blur-md border border-[#E2E8F0]/20 rounded-3xl p-6 sm:p-10 shadow-2xl my-4">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight tracking-tight drop-shadow-sm">
            Bienvenue sur archiv<span className="text-[#38BDF8]">2ie</span>
          </h1>
          
          <div className="font-sans text-white text-base sm:text-lg italic max-w-3xl mx-auto leading-relaxed font-normal space-y-1.5">
            <p>
              "Le savoir ne s'accumule pas, il se transmet. Ce que les anciens ont défriché vous éclaire ; ce que vous découvrirez guidera les suivants."
            </p>
            <p className="text-white/90 text-sm sm:text-base font-medium not-italic">
              À 2iE, chaque réussite est une victoire partagée.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3.5 justify-center items-center pt-2">
            <button 
              onClick={() => handlePageClick('tronc-commun')}
              className="w-full sm:w-auto px-7 py-3.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-2xl shadow-lg shadow-brand/25 hover:shadow-brand/40 transition-all flex items-center justify-center gap-2 text-sm cursor-pointer transform hover:-translate-y-0.5"
            >
              <BookOpen className="h-4 w-4" />
              <span>Accéder aux cours</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handlePageClick('bibliotheque')}
              className="w-full sm:w-auto px-7 py-3.5 bg-white/15 hover:bg-white/20 text-white font-bold rounded-2xl border border-white/25 backdrop-blur-sm transition-all text-sm cursor-pointer transform hover:-translate-y-0.5"
            >
              Consulter la Bibliothèque
            </button>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Human Solidarity Highlight Box */}
        <div className="bg-white border border-[#E2E8F0] rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center gap-6 shadow-sm">
          <div className="p-4 bg-[#F1F5F9] rounded-2xl border border-[#E2D6C0] text-[#1B835E] shadow-xs flex-shrink-0">
            <Users className="h-8 w-8" />
          </div>
          <div className="space-y-1.5 text-center md:text-left flex-1">
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A]">
              Une plateforme vivante alimentée par votre générosité
            </h3>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Chaque fiche de révision, chaque sujet d'examen ou rapport de stage déposé aide des dizaines de camarades à progresser avec confiance. Si vous possédez des documents utiles, partagez-les en 30 secondes.
            </p>
          </div>
          <button
            onClick={() => handlePageClick('contribuer')}
            className="flex-shrink-0 px-5 py-3 rounded-2xl bg-[#1B835E] hover:bg-[#146447] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2 cursor-pointer"
          >
            <span>Partager un document</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Section 1: Quick Access Pillars */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">Parcours d'apprentissage</span>
            <h2 className="font-serif text-3xl font-bold text-[#0F172A] tracking-tight">
              Quatre espaces documentaires essentiels
            </h2>
            <p className="text-[#64748B] text-sm leading-relaxed">
              Naviguez facilement parmi l'ensemble des ressources pédagogiques organisées pour vos études.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Cours */}
            <div className="human-card rounded-2xl p-6 flex flex-col justify-between group">
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] text-[#1B835E] flex items-center justify-center font-bold text-lg flex-shrink-0">
                    📚
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0F172A]">Supports de cours</h3>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Polycopiés d'enseignants, fiches synthétiques d'élèves, syllabus et programmes pédagogiques officiels.
                </p>
              </div>
              <button 
                onClick={() => handlePageClick('tronc-commun')}
                className="mt-6 flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-hover text-left cursor-pointer"
              >
                <span>Parcourir le Tronc Commun</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Annales */}
            <div className="human-card rounded-2xl p-6 flex flex-col justify-between group">
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FCE8E6] text-gee flex items-center justify-center font-bold text-lg flex-shrink-0">
                    📝
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0F172A]">Annales d'examens</h3>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Sujets de devoirs surveillés, examens semestriels et propositions d'éléments de correction annotés.
                </p>
              </div>
              <button 
                onClick={() => handlePageClick('tronc-commun')}
                className="mt-6 flex items-center gap-1.5 text-xs font-bold text-gee hover:underline text-left cursor-pointer"
              >
                <span>Voir les sujets d'examens</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Bibliothèque */}
            <div className="human-card rounded-2xl p-6 flex flex-col justify-between group">
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#FDF0D9] text-gc flex items-center justify-center font-bold text-lg flex-shrink-0">
                    📖
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0F172A]">Bibliothèque technique</h3>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Ouvrages de référence de l'ingénieur, guides Eurocodes, normes environnementales et documentations spécialisées.
                </p>
              </div>
              <button 
                onClick={() => handlePageClick('bibliotheque')}
                className="mt-6 flex items-center gap-1.5 text-xs font-bold text-gc hover:underline text-left cursor-pointer"
              >
                <span>Ouvrir la bibliothèque</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Stages & PFE */}
            <div className="human-card rounded-2xl p-6 flex flex-col justify-between group">
              <div className="space-y-3.5">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E1EEF9] text-geaah flex items-center justify-center font-bold text-lg flex-shrink-0">
                    🗂️
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0F172A]">Stages & PFE</h3>
                </div>
                <p className="text-xs text-[#64748B] leading-relaxed">
                  Rapports de stage validés, mémoires de Projets de Fin d'Études (PFE) d'excellence et canevas Word/LaTeX.
                </p>
              </div>
              <button 
                onClick={() => handlePageClick('rapports')}
                className="mt-6 flex items-center gap-1.5 text-xs font-bold text-geaah hover:underline text-left cursor-pointer"
              >
                <span>Consulter les mémoires</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>
        </section>

        {/* Section 2: Speciality Branches with Semester Pills */}
        <section className="space-y-8 bg-white p-8 sm:p-10 rounded-3xl border border-[#E2E8F0] shadow-[0_4px_24px_rgba(40,30,20,0.03)]">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">Cycle Ingénieur</span>
            <h2 className="font-serif text-3xl font-bold text-[#0F172A] tracking-tight">
              Accès par filières d'ingénierie
            </h2>
            <p className="text-[#64748B] text-sm">
              Sélectionnez votre spécialité à partir du Semestre 5 pour explorer les cours dédiés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* GEE */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border-t-4 border-gee border-l border-r border-b border-[#E2E8F0] shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-gee bg-red-100/70 px-2.5 py-1 rounded-full">
                  Énergies & Systèmes
                </span>
                <h3 className="font-serif text-xl font-bold text-[#0F172A] mt-3">Filière GEE</h3>
                <p className="text-xs text-[#64748B] mt-1">Génie Électrique et Énergétique</p>
              </div>
              
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Semestres S5 - S9 :</span>
                <div className="flex flex-wrap gap-1.5">
                  {['S5D', 'S5S', 'S6D', 'S6S', 'S7', 'S8', 'S9'].map((sem) => (
                    <button 
                      key={sem}
                      onClick={() => handleFiliereClick('gee')}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-[#E2E8F0] hover:bg-gee hover:text-white transition-all text-[#334155] cursor-pointer"
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleFiliereClick('gee')}
                className="pt-2 text-xs font-bold text-gee hover:underline flex items-center gap-1 text-left cursor-pointer"
              >
                <span>Accéder aux ressources GEE</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* GC-BTP */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border-t-4 border-gc border-l border-r border-b border-[#E2E8F0] shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-gc bg-amber-100/70 px-2.5 py-1 rounded-full">
                  Infrastructures & Ouvrages
                </span>
                <h3 className="font-serif text-xl font-bold text-[#0F172A] mt-3">Filière GC-BTP</h3>
                <p className="text-xs text-[#64748B] mt-1">Génie Civil Bâtiment Travaux Publics</p>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Semestres S5 - S9 :</span>
                <div className="flex flex-wrap gap-1.5">
                  {['S5D', 'S5S', 'S6D', 'S6S', 'S7', 'S8', 'S9'].map((sem) => (
                    <button 
                      key={sem}
                      onClick={() => handleFiliereClick('gc-btp')}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-[#E2E8F0] hover:bg-gc hover:text-white transition-all text-[#334155] cursor-pointer"
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleFiliereClick('gc-btp')}
                className="pt-2 text-xs font-bold text-gc hover:underline flex items-center gap-1 text-left cursor-pointer"
              >
                <span>Accéder aux ressources GC-BTP</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* GEAAH */}
            <div className="bg-[#F8FAFC] rounded-2xl p-6 border-t-4 border-geaah border-l border-r border-b border-[#E2E8F0] shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-geaah bg-blue-100/70 px-2.5 py-1 rounded-full">
                  Hydraulique & Assainissement
                </span>
                <h3 className="font-serif text-xl font-bold text-[#0F172A] mt-3">Filière GEAAH</h3>
                <p className="text-xs text-[#64748B] mt-1">Génie Eau Assainissement & AH</p>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-[#94A3B8] block uppercase">Semestres S5 - S9 :</span>
                <div className="flex flex-wrap gap-1.5">
                  {['S5D', 'S5S', 'S6D', 'S6S', 'S7', 'S8', 'S9'].map((sem) => (
                    <button 
                      key={sem}
                      onClick={() => handleFiliereClick('geaah')}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white border border-[#E2E8F0] hover:bg-geaah hover:text-white transition-all text-[#334155] cursor-pointer"
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleFiliereClick('geaah')}
                className="pt-2 text-xs font-bold text-geaah hover:underline flex items-center gap-1 text-left cursor-pointer"
              >
                <span>Accéder aux ressources GEAAH</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>

          {/* Info banner */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl text-[#64748B] text-xs leading-relaxed max-w-4xl mx-auto">
            <div className="p-2.5 bg-white rounded-xl text-[#1B835E] font-bold text-base shadow-sm border border-[#E2E8F0]">
              💡
            </div>
            <div>
              <strong className="text-[#0F172A]">Rappel de structure pédagogique :</strong> Le <strong>Parcours D</strong> correspond à la bifurcation d'harmonisation pour les intégrations d'étudiants post-BTS ou admissions parallèles. Le <strong>Parcours S</strong> désigne le cursus classique intégré post-Classes Préparatoires (CPI) ou post-Bac de l'Institut 2iE.
            </div>
          </div>
        </section>

        {/* Section 3: Latest additions */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-widest text-[#94A3B8]">Nouveautés</span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-[#0F172A]">✨ Derniers documents ajoutés</h2>
              <p className="text-[#64748B] text-xs sm:text-sm mt-1">
                Consultez et téléchargez les ressources pédagogiques récemment approuvées par la modération étudiante.
              </p>
            </div>
            <button 
              onClick={() => handlePageClick('contribuer')}
              className="px-4 py-2.5 text-xs font-bold text-brand hover:text-brand-hover border border-brand/20 bg-[#EAF5EE] rounded-xl transition-all cursor-pointer"
            >
              Proposer un document +
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {recentDocuments.map((doc) => (
              <div 
                key={doc.id}
                className={`human-card p-6 rounded-2xl border-l-4 ${doc.borderClass} flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center justify-between gap-2">
                    <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${doc.badgeClass}`}>
                      {doc.filiere}
                    </span>
                    <span className="text-[10px] font-semibold text-[#94A3B8] bg-[#F8FAFC] border border-[#E2E8F0] px-2.5 py-1 rounded-full">
                      {doc.dateAdded}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0F172A] mt-3 leading-snug">
                    {doc.title}
                  </h3>
                  <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                    {doc.description}
                  </p>
                </div>
                <button 
                  onClick={() => openDriveFolder(doc.driveKey)}
                  className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline text-left cursor-pointer"
                >
                  <Download className="h-4 w-4" />
                  <span>Ouvrir le dossier Drive</span>
                </button>
              </div>
            ))}
          </div>
        </section>

      </div>

    </div>
  );
}

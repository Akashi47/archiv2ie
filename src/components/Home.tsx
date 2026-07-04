import React from 'react';
import { Page, FiliereKey } from '../types';
import { driveLinks } from '../data';
import { BookOpen, Calendar, ArrowRight, Download, FileText, Library, HelpCircle, HardHat, Zap, Droplet, Award, ChevronRight } from 'lucide-react';
import graduatesImg from '../assets/images/remise-diplomes-2ie.jpg';

interface HomeProps {
  setCurrentPage: (page: Page) => void;
  setSelectedFiliere: (filiere: FiliereKey) => void;
}

export default function Home({ setCurrentPage, setSelectedFiliere }: HomeProps) {
  
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
    const link = driveLinks[key];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      alert("📂 Le dossier Drive demandé est en cours de centralisation.\nIl sera disponible très prochainement !");
    }
  };

  return (
    <div className="space-y-16 pb-16">
      
      {/* Hero Banner Section */}
      <div className="relative w-full min-h-[480px] lg:min-h-[540px] flex items-center justify-center text-center overflow-hidden bg-gray-900 px-4 sm:px-6 lg:px-8 py-16">
        
        {/* Background Image with elegant overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src={graduatesImg} 
            alt="Promotion 2iE" 
            className="w-full h-full object-cover object-center opacity-100 transition-transform duration-500"
            referrerPolicy="no-referrer"
          />
          {/* Extremely soft vignetting to let the photo colors stay fully faithful and vibrant */}
          <div className="absolute inset-0 bg-gradient-to-t from-gray-950/30 via-black/10 to-transparent" />
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff04_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>

        {/* Content Box */}
        <div className="relative z-10 max-w-3xl mx-auto space-y-6 bg-gray-950/70 backdrop-blur-md border border-white/10 rounded-2xl p-6 sm:p-10 shadow-2xl my-4">
          
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand/20 border border-brand/30 text-white text-xs font-bold uppercase tracking-wider">
            <Award className="h-4 w-4 text-brand" />
            <span>Portail Étudiant Co-géré</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-white font-bold leading-tight tracking-tight drop-shadow-md">
            Bienvenue sur <span className="text-brand">archiv2ie</span>
          </h1>
          
          <p className="font-sans text-gray-200 text-base sm:text-lg italic max-w-2xl mx-auto leading-relaxed font-light">
            "D'autres ont cherché avant toi. D'autres chercheront après toi. Toi, tu as archiv2ie. <br/>
            <span className="text-brand font-medium not-italic mt-1.5 block text-sm sm:text-base">Parce que la réussite est un sport collectif.</span>"
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-2">
            <button 
              onClick={() => handlePageClick('tronc-commun')}
              className="w-full sm:w-auto px-6 py-3 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl shadow-lg shadow-brand/20 hover:shadow-brand/30 hover:scale-[1.02] transition-all flex items-center justify-center gap-2 text-sm cursor-pointer"
            >
              <span>Accéder aux cours</span>
              <ArrowRight className="h-4 w-4" />
            </button>
            <button 
              onClick={() => handlePageClick('bibliotheque')}
              className="w-full sm:w-auto px-6 py-3 bg-white/10 hover:bg-white/15 text-white font-bold rounded-xl border border-white/20 backdrop-blur-sm hover:scale-[1.02] transition-all text-sm cursor-pointer"
            >
              Consulter la Bibliothèque
            </button>
          </div>

        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">

        {/* Section 1: Quick Access Pillars */}
        <section className="space-y-6">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">
              Quatre piliers fondamentaux
            </h2>
            <p className="text-gray-500 text-sm mt-1.5">
              Accédez instantanément aux sections majeures de la base documentaire partagée.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* Cours */}
            <div className="glass-effect rounded-2xl p-6 card-shadow card-hover-effect flex flex-col justify-between border border-gray-100">
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-gray-900">📚 Supports de Cours</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Présentations de professeurs, fiches synthétiques d'étudiants, programmes officiels et syllabus mis à jour.
                </p>
              </div>
              <button 
                onClick={() => handlePageClick('tronc-commun')}
                className="mt-6 flex items-center gap-1.5 text-xs font-bold text-brand hover:text-brand-hover hover:underline text-left group"
              >
                <span>Parcourir le Tronc Commun</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Annales */}
            <div className="glass-effect rounded-2xl p-6 card-shadow card-hover-effect flex flex-col justify-between border border-gray-100">
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-gray-900">📝 Annales d'Examens</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Sujets de devoirs surveillés (DS), examens finaux, propositions de corrigés officiels ou rédigés par les majors de promo.
                </p>
              </div>
              <button 
                onClick={() => handlePageClick('tronc-commun')}
                className="mt-6 flex items-center gap-1.5 text-xs font-bold text-gee hover:underline text-left group"
              >
                <span>Voir les sujets</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Bibliothèque */}
            <div className="glass-effect rounded-2xl p-6 card-shadow card-hover-effect flex flex-col justify-between border border-gray-100">
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-gray-900">📖 Bibliothèque Technique</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Ouvrages de référence de l'ingénieur, guides Eurocodes, normes ISO et documentations techniques constructeurs.
                </p>
              </div>
              <button 
                onClick={() => handlePageClick('bibliotheque')}
                className="mt-6 flex items-center gap-1.5 text-xs font-bold text-gc hover:underline text-left group"
              >
                <span>Ouvrir la bibliothèque</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

            {/* Stages & PFE */}
            <div className="glass-effect rounded-2xl p-6 card-shadow card-hover-effect flex flex-col justify-between border border-gray-100">
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-gray-900">🗂️ Stages & PFE</h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  Exemples de rapports de stage de licence et de projets de fin d'études (PFE) d'excellence validés, ainsi que des canevas Word/LaTeX.
                </p>
              </div>
              <button 
                onClick={() => handlePageClick('rapports')}
                className="mt-6 flex items-center gap-1.5 text-xs font-bold text-geaah hover:underline text-left group"
              >
                <span>Consulter les rapports</span>
                <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </button>
            </div>

          </div>
        </section>

        {/* Section 2: Speciality Branches with Semester Pills */}
        <section className="space-y-8 bg-gray-50/50 p-8 rounded-3xl border border-gray-100">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="font-serif text-3xl font-bold text-gray-900 tracking-tight">
              Accès par filières d'ingénierie
            </h2>
            <p className="text-gray-500 text-sm">
              Sélectionnez votre spécialité à partir du Semestre 5 pour explorer les cours dédiés.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            {/* GEE */}
            <div className="bg-white rounded-2xl p-6 border-t-4 border-gee shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-gee bg-red-50 px-2 py-0.5 rounded-full">
                  Énergies & Systèmes
                </span>
                <h3 className="font-serif text-xl font-bold text-gray-900 mt-2">Filière GEE</h3>
                <p className="text-xs text-gray-500 mt-1">Génie Électrique et Énergétique</p>
              </div>
              
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Semestres S5 - S9 :</span>
                <div className="flex flex-wrap gap-1.5">
                  {['S5D', 'S5S', 'S6D', 'S6S', 'S7', 'S8', 'S9'].map((sem) => (
                    <button 
                      key={sem}
                      onClick={() => handleFiliereClick('gee')}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-100 hover:bg-gee hover:text-white transition-all text-gray-600"
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleFiliereClick('gee')}
                className="pt-2 text-xs font-bold text-gee hover:underline flex items-center gap-1 text-left"
              >
                <span>Accéder aux ressources GEE</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* GC-BTP */}
            <div className="bg-white rounded-2xl p-6 border-t-4 border-gc shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-gc bg-amber-50 px-2 py-0.5 rounded-full">
                  Infrastructures & Structures
                </span>
                <h3 className="font-serif text-xl font-bold text-gray-900 mt-2">Filière GC-BTP</h3>
                <p className="text-xs text-gray-500 mt-1">Génie Civil Bâtiment Travaux Publics</p>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Semestres S5 - S9 :</span>
                <div className="flex flex-wrap gap-1.5">
                  {['S5D', 'S5S', 'S6D', 'S6S', 'S7', 'S8', 'S9'].map((sem) => (
                    <button 
                      key={sem}
                      onClick={() => handleFiliereClick('gc-btp')}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-100 hover:bg-gc hover:text-white transition-all text-gray-600"
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleFiliereClick('gc-btp')}
                className="pt-2 text-xs font-bold text-gc hover:underline flex items-center gap-1 text-left"
              >
                <span>Accéder aux ressources GC-BTP</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

            {/* GEAAH */}
            <div className="bg-white rounded-2xl p-6 border-t-4 border-geaah shadow-sm hover:shadow-md transition-all space-y-4 flex flex-col justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider font-extrabold text-geaah bg-blue-50 px-2 py-0.5 rounded-full">
                  Hydraulique & Environnement
                </span>
                <h3 className="font-serif text-xl font-bold text-gray-900 mt-2">Filière GEAAH</h3>
                <p className="text-xs text-gray-500 mt-1">Génie Eau Assainissement & AH</p>
              </div>

              <div className="space-y-3">
                <span className="text-[10px] font-bold text-gray-400 block uppercase">Semestres S5 - S9 :</span>
                <div className="flex flex-wrap gap-1.5">
                  {['S5D', 'S5S', 'S6D', 'S6S', 'S7', 'S8', 'S9'].map((sem) => (
                    <button 
                      key={sem}
                      onClick={() => handleFiliereClick('geaah')}
                      className="px-2.5 py-1 text-xs font-bold rounded-lg bg-gray-100 hover:bg-geaah hover:text-white transition-all text-gray-600"
                    >
                      {sem}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={() => handleFiliereClick('geaah')}
                className="pt-2 text-xs font-bold text-geaah hover:underline flex items-center gap-1 text-left"
              >
                <span>Accéder aux ressources GEAAH</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>

          </div>

          {/* Info banner */}
          <div className="flex flex-col sm:flex-row items-center gap-4 p-5 bg-brand/5 border border-brand/10 rounded-2xl text-brand-hover text-xs leading-relaxed max-w-4xl mx-auto">
            <div className="p-2 bg-white rounded-xl text-brand font-bold text-base shadow-sm">
              💡
            </div>
            <div>
              <strong>Rappel de structure pédagogique :</strong> Le <strong>Parcours D</strong> correspond à la bifurcation d'harmonisation pour les intégrations d'étudiants post-BTS ou admissions parallèles. Le <strong>Parcours S</strong> désigne le cursus classique intégré post-Classes Préparatoires (CPI) ou post-Bac de l'Institut 2iE.
            </div>
          </div>
        </section>

        {/* Section 3: Latest additions */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="font-serif text-2xl font-bold text-gray-900">✨ Derniers documents ajoutés</h2>
              <p className="text-gray-500 text-xs mt-1">
                Consultez et téléchargez les ressources pédagogiques récemment approuvées par la modération.
              </p>
            </div>
            <button 
              onClick={() => handlePageClick('contribuer')}
              className="px-4 py-2 text-xs font-bold text-brand hover:text-brand-hover border border-brand/20 bg-brand/5 rounded-xl transition-all"
            >
              Proposer un document +
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Addition 1 */}
            <div className="bg-white p-6 rounded-2xl border-l-4 border-gc shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gc bg-amber-50 px-2 py-0.5 rounded-full uppercase">
                  GC-BTP · Semestre 7
                </span>
                <h3 className="font-serif text-lg font-bold text-gray-900 mt-2.5 leading-snug">
                  Cours de Béton Armé (Eurocode 2)
                </h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Fiches d'exercices corrigées détaillées sur le dimensionnement des poutres en béton armé aux ELU/ELS.
                </p>
              </div>
              <button 
                onClick={() => openDriveFolder('gc-s7')}
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline text-left"
              >
                <Download className="h-4 w-4" />
                <span>Ouvrir le dossier Drive</span>
              </button>
            </div>

            {/* Addition 2 */}
            <div className="bg-white p-6 rounded-2xl border-l-4 border-brand shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-brand bg-emerald-50 px-2 py-0.5 rounded-full uppercase">
                  GEAAH · Semestre 6
                </span>
                <h3 className="font-serif text-lg font-bold text-gray-900 mt-2.5 leading-snug">
                  Dimensionnement Réseaux AEP
                </h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Support de travaux pratiques complet sur le calcul des pertes de charge singulières et linéaires en conduite hydraulique.
                </p>
              </div>
              <button 
                onClick={() => openDriveFolder('geaah-s6d')}
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline text-left"
              >
                <Download className="h-4 w-4" />
                <span>Ouvrir le dossier Drive</span>
              </button>
            </div>

            {/* Addition 3 */}
            <div className="bg-white p-6 rounded-2xl border-l-4 border-gee shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
              <div>
                <span className="text-[10px] font-bold text-gee bg-red-50 px-2 py-0.5 rounded-full uppercase">
                  GEE · Options S9
                </span>
                <h3 className="font-serif text-lg font-bold text-gray-900 mt-2.5 leading-snug">
                  Systèmes Solaires Photovoltaïques
                </h3>
                <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                  Guide pratique d'installation, de couplage et de configuration des onduleurs industriels connectés au réseau.
                </p>
              </div>
              <button 
                onClick={() => openDriveFolder('gee-op1')}
                className="mt-6 inline-flex items-center gap-1.5 text-xs font-bold text-brand hover:underline text-left"
              >
                <Download className="h-4 w-4" />
                <span>Ouvrir le dossier Drive</span>
              </button>
            </div>

          </div>
        </section>

      </div>

    </div>
  );
}

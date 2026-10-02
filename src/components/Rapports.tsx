import React from 'react';
import { driveLinks } from '../data';
import { FileText, FolderArchive, GraduationCap, Compass, Download, ArrowUpRight, Sparkles, Award } from 'lucide-react';

export default function Rapports() {

  const openDriveFolder = (key: string) => {
    const link = driveLinks[key] || driveLinks.default;
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      alert("📂 Le dossier Drive demandé est en cours de centralisation.\nIl sera disponible très prochainement !");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
      
      {/* Header section */}
      <div className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight">
          Rapports de Stages, PFE & Guides
        </h1>
        
        <div className="human-note p-6 sm:p-8 rounded-2xl sm:rounded-3xl space-y-2">
          <p className="font-sans text-[#334155] text-base sm:text-lg italic leading-relaxed">
            "Le stage n'est pas la fin des études. C'est le moment où vous découvrez que tout ce que vous avez appris n'était que le début."
          </p>
        </div>

        <p className="text-[#64748B] text-xs sm:text-sm leading-relaxed pt-2">
          Que vous prépariez votre premier rapport de stage d'immersion, votre Projet de Fin d'Études (PFE) ou un compte-rendu technique de laboratoire, vous n'avez pas à partir d'une page blanche. Des promotions entières d'ingénieurs 2iE sont passées avant vous, ont bâti des méthodologies rigoureuses et ont accepté de transmettre leurs travaux.
        </p>
        
        <div className="inline-flex items-center gap-2 p-3 bg-white border border-[#E2E8F0] rounded-2xl text-brand font-bold text-xs shadow-2xs">
          <Sparkles className="h-4 w-4 text-gc" />
          <span>Utilisez ce qu'ils ont construit. Faites mieux. Partagez à votre tour.</span>
        </div>
      </div>

      <hr className="border-[#E2E8F0]" />

      {/* Main Grid for folders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
        
        {/* Card 1: Rapports de stage */}
        <div className="human-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-4 group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#EAF5EE] text-[#1B835E] flex items-center justify-center font-bold text-lg flex-shrink-0">
                  📁
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0F172A]">
                  Rapports de Stage
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Exemples de rapports de stage de technicien supérieur ou d'assistant ingénieur répertoriés et classés par filière et par semestre d'enseignement.
            </p>
          </div>
          <button
            onClick={() => openDriveFolder('rapports-stage')}
            className="w-full sm:w-fit px-5 py-3 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all text-left flex items-center justify-between sm:justify-start gap-2 cursor-pointer"
          >
            <span>Accéder aux Rapports de Stage</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {/* Card 2: Rapports de PFE */}
        <div className="human-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-4 group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FCE8E6] text-gee flex items-center justify-center font-bold text-lg flex-shrink-0">
                  📄
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0F172A]">
                  Rapports de PFE
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Projets de fin d'études soutenus avec succès par les élèves ingénieurs, classés rigoureusement par spécialité et par année académique.
            </p>
          </div>
          <button
            onClick={() => openDriveFolder('rapports-pfe')}
            className="w-full sm:w-fit px-5 py-3 bg-gee hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all text-left flex items-center justify-between sm:justify-start gap-2 cursor-pointer"
          >
            <span>Consulter les Rapports de PFE</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {/* Card 3: Rapports de projets & TPs */}
        <div className="human-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-4 group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#FDF0D9] text-gc flex items-center justify-center font-bold text-lg flex-shrink-0">
                  🔬
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0F172A]">
                  Rapports de Projets & TPs
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Modèles de notes de calculs géotechniques, d'assainissement, de réseaux d'eau ou d'électronique pour vos projets de groupe de fin de module.
            </p>
          </div>
          <button
            onClick={() => openDriveFolder('rapports-projets')}
            className="w-full sm:w-fit px-5 py-3 bg-gc hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all text-left flex items-center justify-between sm:justify-start gap-2 cursor-pointer"
          >
            <span>Voir les Rapports & TPs</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {/* Card 4: Guides & Modeles */}
        <div className="human-card p-6 sm:p-8 rounded-2xl flex flex-col justify-between space-y-4 group">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E1EEF9] text-geaah flex items-center justify-center font-bold text-lg flex-shrink-0">
                  📋
                </div>
                <h3 className="font-serif text-xl font-bold text-[#0F172A]">
                  Guides & Modèles de Rédaction
                </h3>
              </div>
            </div>
            <p className="text-xs sm:text-sm text-[#64748B] leading-relaxed">
              Chartes d'élaboration de mémoires officielles de 2iE, canevas Word pré-formatés, paquetages LaTeX pré-configurés et conseils pour la soutenance orale.
            </p>
          </div>
          <button
            onClick={() => openDriveFolder('guides-modeles')}
            className="w-full sm:w-fit px-5 py-3 bg-geaah hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all text-left flex items-center justify-between sm:justify-start gap-2 cursor-pointer"
          >
            <span>Télécharger les Modèles</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

      </div>

    </div>
  );
}

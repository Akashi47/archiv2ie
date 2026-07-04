import React from 'react';
import { driveLinks } from '../data';
import { FileText, FolderArchive, GraduationCap, Compass, Download, ArrowUpRight } from 'lucide-react';

export default function Rapports() {

  const openDriveFolder = (key: string) => {
    const link = driveLinks[key];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      alert("📂 Le dossier Drive demandé est en cours de centralisation.\nIl sera disponible très prochainement !");
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Header section */}
      <div className="space-y-4 max-w-4xl">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Rapports de Stages, PFE & Guides de Rédaction
        </h1>
        
        <div className="bg-gradient-to-r from-brand/5 via-brand/5 to-transparent border-l-4 border-brand p-6 rounded-r-2xl space-y-2">
          <p className="font-sans text-gray-700 text-base sm:text-lg italic leading-relaxed">
            "Le stage n'est pas la fin des études. C'est le moment où vous découvrez que tout ce que vous avez appris n'était que le début."
          </p>
        </div>

        <p className="text-gray-500 text-sm leading-relaxed pt-2">
          Que vous prépariez votre premier rapport de stage, votre Projet de Fin d'Études (PFE) ou un compte-rendu de projet de classe, vous n'avez pas à partir de zéro. D'autres sont passés avant vous, ont cherché le bon plan de rapport, la bonne structure réglementaire ou la formulation parfaite – et ont accepté de partager.
        </p>
        
        <strong className="text-brand-hover text-sm block font-bold uppercase tracking-wider">
          Utilisez ce qu'ils ont construit. Faites mieux. Partagez à votre tour.
        </strong>
      </div>

      <hr className="border-gray-100" />

      {/* Main Grid for folders */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
        
        {/* Card 1: Rapports de stage */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-gray-900">
              📁 Rapports de Stage
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Exemples de rapports de stage de technicien supérieur ou d'assistant ingénieur répertoriés et classés par filière et par semestre d'enseignement.
            </p>
          </div>
          <button
            onClick={() => openDriveFolder('rapports-stage')}
            className="w-full sm:w-fit px-5 py-3 bg-brand hover:bg-brand-hover text-white text-xs font-bold rounded-xl shadow-sm transition-all text-left flex items-center justify-between sm:justify-start gap-2"
          >
            <span>Accéder aux Rapports de Stage</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {/* Card 2: Rapports de PFE */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-gray-900">
              📄 Rapports de PFE
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Projets de fin d'études soutenus avec succès par les anciens élèves ingénieurs, classés rigoureusement par spécialité et par année académique.
            </p>
          </div>
          <button
            onClick={() => openDriveFolder('rapports-pfe')}
            className="w-full sm:w-fit px-5 py-3 bg-gee hover:bg-red-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all text-left flex items-center justify-between sm:justify-start gap-2"
          >
            <span>Consulter les Rapports de PFE</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {/* Card 3: Rapports de projets & TPs */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-gray-900">
              🔬 Rapports de Projets & TPs
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Modèles de notes de calculs géotechniques, d'assainissement, de réseaux d'eau ou d'électronique pour vos projets de groupe de fin de module.
            </p>
          </div>
          <button
            onClick={() => openDriveFolder('rapports-projets')}
            className="w-full sm:w-fit px-5 py-3 bg-gc hover:bg-amber-700 text-white text-xs font-bold rounded-xl shadow-sm transition-all text-left flex items-center justify-between sm:justify-start gap-2"
          >
            <span>Voir les Rapports & TPs</span>
            <ArrowUpRight className="h-4 w-4" />
          </button>
        </div>

        {/* Card 4: Guides & Modeles */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between space-y-4">
          <div className="space-y-3">
            <h3 className="font-serif text-xl font-bold text-gray-900">
              📋 Guides & Modèles de Rédaction
            </h3>
            <p className="text-xs text-gray-500 leading-relaxed">
              Chartes d'élaboration de mémoires officielles de 2iE, canevas Word pré-formatés, paquetages LaTeX pré-configurés et conseils d'expression orale.
            </p>
          </div>
          <button
            onClick={() => openDriveFolder('guides-modeles')}
            className="w-full sm:w-fit px-5 py-3 bg-geaah hover:bg-blue-800 text-white text-xs font-bold rounded-xl shadow-sm transition-all text-left flex items-center justify-between sm:justify-start gap-2"
          >
            <span>Télécharger les Modèles</span>
            <ArrowUpRight className="h-4 w-4 animate-bounce" />
          </button>
        </div>

      </div>

    </div>
  );
}

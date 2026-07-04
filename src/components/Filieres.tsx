import React from 'react';
import { FiliereKey } from '../types';
import { filieresData, driveLinks } from '../data';
import { Folder, Zap, HardHat, Droplet, GraduationCap, ChevronRight, Download, BookOpen, AlertCircle } from 'lucide-react';

interface FilieresProps {
  selectedFiliere: FiliereKey;
  setSelectedFiliere: (filiere: FiliereKey) => void;
}

export default function Filieres({ selectedFiliere, setSelectedFiliere }: FilieresProps) {
  
  const currentData = filieresData.find(f => f.key === selectedFiliere) || filieresData[0];

  const openDriveFolder = (key: string) => {
    const link = driveLinks[key];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      alert("📂 Le dossier Drive demandé est en cours de centralisation.\nIl sera disponible très prochainement !");
    }
  };

  const getFiliereIcon = (key: FiliereKey, className: string) => {
    switch(key) {
      case 'gee':
        return <Zap className={className} />;
      case 'gc-btp':
        return <HardHat className={className} />;
      case 'geaah':
        return <Droplet className={className} />;
    }
  };

  // Grouping semesters for visual separation
  const s5s6Semesters = currentData.semesters.filter(s => s.key.startsWith('S5') || s.key.startsWith('S6'));
  const s7s8Semesters = currentData.semesters.filter(s => s.key === 'S7' || s.key === 'S8');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Tab Switcher at the top */}
      <div className="flex flex-col sm:flex-row justify-center items-stretch gap-3 max-w-4xl mx-auto">
        {filieresData.map((filiere) => (
          <button
            key={filiere.key}
            onClick={() => setSelectedFiliere(filiere.key)}
            className={`flex-1 px-6 py-4 rounded-2xl border text-left flex items-center justify-between transition-all transform hover:-translate-y-0.5 active:translate-y-0 shadow-sm ${
              selectedFiliere === filiere.key
                ? `bg-white ${filiere.borderClass} ring-2 ring-offset-2 ring-${filiere.key === 'gee' ? 'red' : filiere.key === 'gc-btp' ? 'amber' : 'blue'}-500`
                : 'bg-gray-50 border-gray-100 hover:bg-white text-gray-500 hover:text-gray-900'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-2.5 rounded-xl ${
                selectedFiliere === filiere.key 
                  ? fililiereBg(filiere.key)
                  : 'bg-gray-200/50 text-gray-400'
              }`}>
                {getFiliereIcon(filiere.key, "h-5 w-5")}
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-400 block">Filière</span>
                <span className="font-serif font-bold text-base block text-gray-900">{filiere.name}</span>
              </div>
            </div>
            <ChevronRight className={`h-5 w-5 transition-transform ${
              selectedFiliere === filiere.key ? currentData.textClass : 'text-gray-300'
            }`} />
          </button>
        ))}
      </div>

      {/* Main content pane */}
      <div className="space-y-10 animate-fade-in">
        
        {/* Header summary of selected branch */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${currentData.badgeClass}`}>
              Filière d'ingénierie
            </span>
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-widest">Semestres S5 à S9</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight leading-tight">
            {currentData.fullName} <span className="font-sans text-brand-hover text-2xl font-semibold">({currentData.name})</span>
          </h1>

          <div className={`${currentData.bgClass} border-l-4 ${currentData.borderClass} p-6 rounded-r-2xl space-y-2`}>
            <p className={`font-sans text-lg italic leading-relaxed text-gray-700`}>
              "{currentData.quote}"
            </p>
          </div>
        </div>

        {/* SECTION 1: S5 / S6 Bifurcation */}
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-serif text-2xl font-bold text-gray-900">
              🔴 Semestres 5 & 6 <span className="text-gray-400 font-light text-base block sm:inline sm:ml-2">Bifurcation et Harmonisation de Cursus</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {s5s6Semesters.map((sem) => (
              <div key={sem.key} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider ${
                    sem.key.endsWith('D') ? 'bg-indigo-50 text-indigo-700' : 'bg-emerald-50 text-emerald-700'
                  }`}>
                    Parcours {sem.key.slice(-1)}
                  </span>
                  <h3 className="font-serif text-lg font-bold text-gray-900 mt-3">{sem.title}</h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    {sem.description}
                  </p>
                </div>
                <button
                  onClick={() => openDriveFolder(sem.driveKey)}
                  className={`mt-6 inline-flex items-center gap-1.5 text-xs font-bold ${currentData.textClass} hover:underline text-left`}
                >
                  <Download className="h-4 w-4" />
                  <span>Dossier {sem.key} 📂</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 2: S7 / S8 (Master 1) */}
        <div className="space-y-6">
          <div className="border-b border-gray-100 pb-3">
            <h2 className="font-serif text-2xl font-bold text-gray-900">
              🔴 Semestres 7 & 8 <span className="text-gray-400 font-light text-base block sm:inline sm:ml-2">Phases Fondamentales de Master d'Ingénieur</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {s7s8Semesters.map((sem) => (
              <div key={sem.key} className="bg-white rounded-2xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                <div>
                  <span className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-purple-50 text-purple-700`}>
                    Master 1 · {sem.key}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-gray-900 mt-3">{sem.title}</h3>
                  <p className="text-xs text-gray-500 mt-2 leading-relaxed">
                    {sem.description}
                  </p>
                </div>
                <button
                  onClick={() => openDriveFolder(sem.driveKey)}
                  className={`mt-6 inline-flex items-center gap-1.5 text-xs font-bold ${currentData.textClass} hover:underline text-left`}
                >
                  <Download className="h-4 w-4" />
                  <span>Dossier {sem.key} 📂</span>
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SECTION 3: S9 Specialization options */}
        {currentData.options && currentData.options.length > 0 && (
          <div className="space-y-6">
            <div className="border-b border-gray-100 pb-3">
              <h2 className="font-serif text-2xl font-bold text-gray-900">
                🔴 Semestre 9 <span className="text-gray-400 font-light text-base block sm:inline sm:ml-2">Options Avancées et Spécialisations de Fin d'Études</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentData.options.map((opt, index) => (
                <div key={index} className="bg-gray-50 rounded-2xl p-6 border border-gray-100 hover:bg-white hover:shadow-md transition-all flex flex-col justify-between space-y-6">
                  
                  <div className="space-y-4">
                    <h3 className="font-serif text-lg font-bold text-gray-900 leading-tight">
                      {opt.title}
                    </h3>
                    <p className="text-xs text-gray-500 leading-relaxed">
                      {opt.description}
                    </p>

                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] uppercase font-bold text-gray-400 tracking-wider block">
                        Exemples de matières enseignées :
                      </span>
                      <ul className="space-y-1.5">
                        {opt.subjects.map((sub, sidx) => (
                          <li key={sidx} className="flex items-start gap-2 text-xs text-gray-600">
                            <span className={`inline-block h-1.5 w-1.5 rounded-full mt-1.5 ${
                              selectedFiliere === 'gee' ? 'bg-red-500' : selectedFiliere === 'gc-btp' ? 'bg-amber-500' : 'bg-blue-500'
                            }`} />
                            <span>{sub}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <button
                    onClick={() => openDriveFolder(opt.driveKey)}
                    className={`inline-flex items-center gap-1.5 text-xs font-bold ${currentData.textClass} hover:underline text-left`}
                  >
                    <Download className="h-4 w-4" />
                    <span>Dossier Option {index + 1} 📂</span>
                  </button>

                </div>
              ))}
            </div>
          </div>
        )}

      </div>

    </div>
  );
}

// Utility function to map background hover colors
function fililiereBg(key: FiliereKey) {
  switch (key) {
    case 'gee': return 'bg-red-100 text-gee';
    case 'gc-btp': return 'bg-amber-100 text-gc';
    case 'geaah': return 'bg-blue-100 text-geaah';
  }
}

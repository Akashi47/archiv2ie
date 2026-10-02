import React from 'react';
import { FiliereKey } from '../types';
import { filieresData, driveLinks } from '../data';
import { Folder, Zap, HardHat, Droplet, GraduationCap, ChevronRight, Download, BookOpen, AlertCircle, Sparkles } from 'lucide-react';

interface FilieresProps {
  selectedFiliere: FiliereKey;
  setSelectedFiliere: (filiere: FiliereKey) => void;
}

export default function Filieres({ 
  selectedFiliere, 
  setSelectedFiliere
}: FilieresProps) {
  
  const currentData = filieresData.find(f => f.key === selectedFiliere) || filieresData[0];

  const openDriveFolder = (key: string) => {
    const link = driveLinks[key] || driveLinks.default;
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-12 space-y-10">
      
      {/* Main content pane */}
      <div className="space-y-10 animate-fade-in">
        
        {/* Header summary of selected branch */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${currentData.badgeClass}`}>
              Filière d'ingénierie
            </span>
            <span className="text-xs font-semibold text-[#94A3B8] uppercase tracking-widest">Semestres S5 à S9</span>
          </div>

          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight leading-tight">
            {currentData.fullName} <span className="font-sans text-brand text-2xl sm:text-3xl font-semibold">({currentData.name})</span>
          </h1>

          <div className="human-note p-6 sm:p-8 rounded-2xl sm:rounded-3xl space-y-2">
            <p className="font-sans text-lg italic leading-relaxed text-[#334155]">
              "{currentData.quote}"
            </p>
          </div>
        </div>

        {/* SECTION 1: S5 / S6 Bifurcation */}
        <div className="space-y-6">
          <div className="border-b border-[#E2E8F0] pb-3">
            <h2 className="font-serif text-2xl font-bold text-[#0F172A]">
              🌱 Semestres 5 & 6 <span className="text-[#94A3B8] font-light text-base block sm:inline sm:ml-2">Bifurcation et Harmonisation de Cursus</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {s5s6Semesters.map((sem) => (
              <div key={sem.key} className="human-card rounded-2xl p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                      sem.key.endsWith('D') ? 'bg-indigo-100/70 text-indigo-800' : 'bg-emerald-100/70 text-emerald-800'
                    }`}>
                      Parcours {sem.key.slice(-1)}
                    </span>
                  </div>
                  <h3 className="font-serif text-lg font-bold text-[#0F172A] mt-3">{sem.title}</h3>
                  <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                    {sem.description}
                  </p>
                </div>
                <button
                  onClick={() => openDriveFolder(sem.driveKey)}
                  className={`mt-6 inline-flex items-center gap-1.5 text-xs font-bold ${currentData.textClass} hover:underline text-left cursor-pointer`}
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
          <div className="border-b border-[#E2E8F0] pb-3">
            <h2 className="font-serif text-2xl font-bold text-[#0F172A]">
              🌿 Semestres 7 & 8 <span className="text-[#94A3B8] font-light text-base block sm:inline sm:ml-2">Phases Fondamentales de Master d'Ingénieur</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {s7s8Semesters.map((sem) => (
              <div key={sem.key} className="human-card rounded-2xl p-6 flex flex-col justify-between group">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="inline-block px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider bg-purple-100/70 text-purple-800">
                      Master 1 · {sem.key}
                    </span>
                  </div>
                  <h3 className="font-serif text-xl font-bold text-[#0F172A] mt-3">{sem.title}</h3>
                  <p className="text-xs text-[#64748B] mt-2 leading-relaxed">
                    {sem.description}
                  </p>
                </div>
                <button
                  onClick={() => openDriveFolder(sem.driveKey)}
                  className={`mt-6 inline-flex items-center gap-1.5 text-xs font-bold ${currentData.textClass} hover:underline text-left cursor-pointer`}
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
            <div className="border-b border-[#E2E8F0] pb-3">
              <h2 className="font-serif text-2xl font-bold text-[#0F172A]">
                🌳 Semestre 9 <span className="text-[#94A3B8] font-light text-base block sm:inline sm:ml-2">Options Avancées et Spécialisations de Fin d'Études</span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentData.options.map((opt, index) => (
                <div key={index} className="human-card rounded-2xl p-6 flex flex-col justify-between space-y-6 group">
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider">Option #{index + 1}</span>
                    </div>
                    <h3 className="font-serif text-lg font-bold text-[#0F172A] leading-tight">
                      {opt.title}
                    </h3>
                    <p className="text-xs text-[#64748B] leading-relaxed">
                      {opt.description}
                    </p>

                    <div className="space-y-2 pt-2">
                      <span className="text-[10px] uppercase font-bold text-[#94A3B8] tracking-wider block">
                        Exemples de matières enseignées :
                      </span>
                      <ul className="space-y-1.5">
                        {opt.subjects.map((sub, sidx) => (
                          <li key={sidx} className="flex items-start gap-2 text-xs text-[#334155]">
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
                    className={`inline-flex items-center gap-1.5 text-xs font-bold ${currentData.textClass} hover:underline text-left cursor-pointer`}
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
    case 'gee': return 'bg-[#FCE8E6] text-gee';
    case 'gc-btp': return 'bg-[#FDF0D9] text-gc';
    case 'geaah': return 'bg-[#E1EEF9] text-geaah';
  }
}

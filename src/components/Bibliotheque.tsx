import React, { useState } from 'react';
import { libraryCategories, driveLinks } from '../data';
import { Calculator, Droplet, HardHat, Zap, Leaf, Map, TrendingUp, Wrench, ExternalLink, Library, Copy, Check, BookMarked, Sparkles } from 'lucide-react';

export default function Bibliotheque() {
  const [copied, setCopied] = useState(false);

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
      
      {/* Page Title */}
      <div className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-[#0F172A] tracking-tight">
          Bibliothèque Numérique
        </h1>

        <div className="human-note p-6 sm:p-8 rounded-2xl sm:rounded-3xl space-y-2">
          <p className="font-sans text-[#334155] text-base sm:text-lg italic leading-relaxed">
            "Un ingénieur qui ne lit pas est un ingénieur qui stagne. Explorez les manuels, Eurocodes, mémentos et recueils techniques indispensables."
          </p>
        </div>
      </div>

      {/* Grid Categories */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {libraryCategories.map((cat) => (
          <div 
            key={cat.id} 
            className="human-card p-6 rounded-2xl flex flex-col justify-between group"
          >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-[#0F172A] leading-tight">
                    {cat.title}
                  </h3>
                </div>
                
                <p className="text-xs text-[#64748B] leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <button
                onClick={() => openDriveFolder(cat.driveKey)}
                className="mt-6 w-full text-center py-2.5 rounded-xl text-xs font-bold bg-[#F8FAFC] hover:bg-brand hover:text-white border border-[#E2E8F0] hover:border-brand transition-all text-[#334155] block cursor-pointer"
              >
                Ouvrir le dossier Drive 📁
              </button>
            </div>
          ))}
        </div>

      {/* OPAC CDI Physical Catalog Section */}
      <div className="max-w-4xl mx-auto mt-16 p-8 sm:p-10 bg-white border border-[#E2E8F0] rounded-3xl text-center space-y-6 shadow-[0_4px_24px_rgba(40,30,20,0.03)]">
        <div className="p-3 bg-[#EAF5EE] text-[#1B835E] rounded-2xl w-fit mx-auto font-bold text-2xl border border-[#1B835E]/20">
          🏛️
        </div>
        
        <div className="space-y-2">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-[#0F172A]">
            Recherche avancée au catalogue physique (CDI 2iE)
          </h3>
          <p className="text-[#64748B] text-xs sm:text-sm max-w-2xl mx-auto leading-relaxed">
            Vous cherchez un ouvrage, un manuel de cours ou une thèse d'ingénieur disponible physiquement au Centre de Documentation et d'Information (CDI) sur le campus de l'Institut 2iE ?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a 
            href="http://documentation.2ie-edu.org/cdi2ie/opac_css/index.php" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-6 py-3.5 bg-brand hover:bg-brand-hover text-white font-bold rounded-2xl text-xs sm:text-sm shadow-sm transition-all transform hover:-translate-y-0.5 cursor-pointer"
          >
            <span>Consulter le catalogue en ligne (OPAC)</span>
            <ExternalLink className="h-4 w-4" />
          </a>
          
          <button
            onClick={() => {
              navigator.clipboard.writeText("http://documentation.2ie-edu.org/cdi2ie/opac_css/index.php");
              setCopied(true);
              setTimeout(() => setCopied(false), 2500);
            }}
            className="inline-flex items-center gap-2 px-5 py-3.5 bg-[#F8FAFC] hover:bg-[#F4ECE1] text-[#334155] font-bold rounded-2xl text-xs sm:text-sm border border-[#E2E8F0] transition-all shadow-sm cursor-pointer"
            title="Copier le lien direct vers le catalogue en ligne de 2iE"
          >
            {copied ? (
              <>
                <span>Lien copié ! 📋</span>
                <Check className="h-4 w-4 text-emerald-600" />
              </>
            ) : (
              <>
                <span>Copier le lien direct</span>
                <Copy className="h-4 w-4 text-[#94A3B8]" />
              </>
            )}
          </button>
        </div>
        
        <p className="text-[11px] text-[#94A3B8] max-w-md mx-auto">
          Note : Le catalogue officiel de 2iE utilise une adresse HTTP standard. Si le lien ne s'ouvre pas automatiquement, copiez-le ci-dessus et ouvrez-le directement dans votre navigateur.
        </p>
      </div>

    </div>
  );
}

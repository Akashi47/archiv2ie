import React, { useState } from 'react';
import { libraryCategories, driveLinks } from '../data';
import { CourseCategory } from '../types';
import { Calculator, Droplet, HardHat, Zap, Leaf, Map, TrendingUp, Wrench, ExternalLink, Search, Library, AlertCircle, Copy, Check } from 'lucide-react';

export default function Bibliotheque() {
  const [searchQuery, setSearchQuery] = useState('');
  const [copied, setCopied] = useState(false);

  const openDriveFolder = (key: string) => {
    const link = driveLinks[key];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      alert("📂 Le dossier Drive demandé est en cours de centralisation.\nIl sera disponible très prochainement !");
    }
  };

  const getCategoryIcon = (iconName: string) => {
    const props = { className: "h-6 w-6 text-brand" };
    switch(iconName) {
      case "Calculator": return <Calculator {...props} />;
      case "Droplet": return <Droplet {...props} />;
      case "HardHat": return <HardHat {...props} />;
      case "Zap": return <Zap {...props} />;
      case "Leaf": return <Leaf {...props} />;
      case "Map": return <Map {...props} />;
      case "TrendingUp": return <TrendingUp {...props} />;
      case "Wrench": return <Wrench {...props} />;
      default: return <Library {...props} />;
    }
  };

  const filteredCategories = libraryCategories.filter(cat => 
    cat.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Page Title */}
      <div className="space-y-4">
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-gray-900 tracking-tight">
          Bibliothèque Numérique
        </h1>

        <div className="bg-gradient-to-r from-brand/5 via-brand/5 to-transparent border-l-4 border-brand p-6 rounded-r-2xl space-y-2">
          <p className="font-sans text-gray-600 text-base sm:text-lg italic leading-relaxed">
            "Un ingénieur qui ne lit pas est un ingénieur qui stagne."
          </p>
        </div>
      </div>

      {/* Quick Search */}
      <div className="relative max-w-xl">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder="Rechercher une étagère ou une catégorie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand/30 focus:border-brand transition-all shadow-sm"
        />
      </div>

      {/* Grid Categories */}
      {filteredCategories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 card-shadow flex flex-col items-center justify-center space-y-3">
          <AlertCircle className="h-10 w-10 text-gray-300" />
          <h3 className="text-base font-bold text-gray-700">Aucun résultat</h3>
          <p className="text-xs text-gray-400 max-w-sm leading-relaxed">
            Nous n'avons pas trouvé d'étagère correspondant à votre recherche. Essayez un autre terme de recherche.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredCategories.map((cat) => (
            <div 
              key={cat.id} 
              className="glass-effect p-6 rounded-2xl card-shadow card-hover-effect flex flex-col justify-between border border-gray-100 bg-white"
            >
              <div className="space-y-4">
                <h3 className="font-serif text-lg font-bold text-gray-900 leading-tight">
                  {cat.title}
                </h3>
                
                <p className="text-xs text-gray-500 leading-relaxed">
                  {cat.description}
                </p>
              </div>

              <button
                onClick={() => openDriveFolder(cat.driveKey)}
                className="mt-6 w-full text-center py-2.5 rounded-xl text-xs font-bold bg-gray-50 hover:bg-brand hover:text-white border border-gray-100 hover:border-brand transition-all text-gray-600 block"
              >
                Ouvrir le dossier Drive 📁
              </button>
            </div>
          ))}
        </div>
      )}

      {/* OPAC CDI Physical Catalog Section */}
      <div className="max-w-4xl mx-auto mt-16 p-8 bg-gray-50 border border-gray-100 rounded-3xl text-center space-y-6 shadow-sm">
        <div className="p-3 bg-brand/10 text-brand rounded-full w-fit mx-auto font-bold text-2xl">
          📚
        </div>
        
        <div className="space-y-2">
          <h3 className="font-serif text-xl sm:text-2xl font-bold text-gray-900">
            Recherche avancée au catalogue physique (CDI)
          </h3>
          <p className="text-gray-500 text-xs max-w-2xl mx-auto leading-relaxed">
            Vous cherchez un ouvrage, un manuel de cours ou une thèse d'ingénieur disponible physiquement au Centre de Documentation et d'Information (CDI) sur le campus de l'Institut 2iE ?
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <a 
            href="http://documentation.2ie-edu.org/cdi2ie/opac_css/index.php" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-brand hover:bg-brand-hover text-white font-bold rounded-xl text-xs sm:text-sm shadow-md transition-all transform hover:-translate-y-0.5"
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
            className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-gray-100 text-gray-700 font-bold rounded-xl text-xs sm:text-sm border border-gray-200 transition-all shadow-sm cursor-pointer"
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
                <Copy className="h-4 w-4 text-gray-500" />
              </>
            )}
          </button>
        </div>
        
        <p className="text-[10px] text-gray-400 max-w-md mx-auto">
          Note : Le catalogue officiel de 2iE utilise une adresse non-sécurisée (HTTP). Si le lien ne s'ouvre pas, copiez-le ci-dessus et collez-le directement dans un nouvel onglet de votre navigateur.
        </p>
      </div>

    </div>
  );
}

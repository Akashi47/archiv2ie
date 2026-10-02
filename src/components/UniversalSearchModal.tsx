import React, { useState, useEffect, useRef, useMemo } from 'react';
import { Page, FiliereKey, DocTypeFilter, SearchableItem } from '../types';
import { allSearchableItems } from '../searchData';
import { driveLinks } from '../data';
import { 
  Search, 
  X, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Library, 
  ExternalLink, 
  ArrowRight, 
  Sparkles, 
  CornerDownLeft, 
  Layers, 
  Award, 
  CheckCircle2, 
  HelpCircle,
  Hash
} from 'lucide-react';

interface UniversalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  setCurrentPage: (page: Page) => void;
  onSelectFiliere?: (filiereKey: FiliereKey) => void;
}

const FILTER_CONFIG: { id: DocTypeFilter; label: string; icon: any }[] = [
  { id: 'all', label: 'Tous', icon: Layers },
  { id: 'cours', label: 'Cours & Polycopiés', icon: BookOpen },
  { id: 'examens', label: 'Examens & Annales', icon: Award },
  { id: 'td-tp', label: 'TD & TP', icon: FileText },
  { id: 'rapports', label: 'Rapports & PFE', icon: GraduationCap },
  { id: 'bibliotheque', label: 'Bibliothèque & Mémentos', icon: Library },
  { id: 'specialites', label: 'Spécialités S5-S9', icon: Sparkles },
];

const SUGGESTED_TAGS = [
  'Béton armé',
  'Hydraulique',
  'Algèbre',
  'PFE',
  'Eurocodes',
  'Photovoltaïque',
  'RDM',
  'Topographie',
  'QGIS',
  'Assainissement',
  'Thermodynamique',
  'Rapports de Stage'
];

export default function UniversalSearchModal({
  isOpen,
  onClose,
  setCurrentPage,
  onSelectFiliere
}: UniversalSearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<DocTypeFilter>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Focus input on open
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
      setSelectedIndex(0);
    } else {
      setQuery('');
      setActiveFilter('all');
    }
  }, [isOpen]);

  // Global keydown handler for modal (Escape, ArrowUp, ArrowDown, Enter)
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Normalized search query terms
  const searchTerms = useMemo(() => {
    return query
      .toLowerCase()
      .trim()
      .split(/\s+/)
      .filter(t => t.length > 0);
  }, [query]);

  // Filtered and scored items
  const filteredResults = useMemo(() => {
    let list = allSearchableItems;

    // Filter by type
    if (activeFilter !== 'all') {
      list = list.filter(item => item.category === activeFilter);
    }

    // Filter by query
    if (searchTerms.length === 0) {
      return list.slice(0, 14); // default list preview
    }

    return list.filter(item => {
      const titleLower = item.title.toLowerCase();
      const descLower = item.description.toLowerCase();
      const levelLower = item.filiereOrLevel.toLowerCase();
      const keywordsLower = item.keywords.map(k => k.toLowerCase()).join(' ');

      const fullText = `${titleLower} ${descLower} ${levelLower} ${keywordsLower}`;

      return searchTerms.every(term => fullText.includes(term));
    });
  }, [searchTerms, activeFilter]);

  // Reset selected index when filtered list changes
  useEffect(() => {
    setSelectedIndex(0);
  }, [query, activeFilter]);

  // Handle keyboard navigation in result list
  const handleInputKeyDown = (e: React.KeyboardEvent) => {
    if (filteredResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev + 1) % filteredResults.length);
      scrollItemIntoView((selectedIndex + 1) % filteredResults.length);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev - 1 + filteredResults.length) % filteredResults.length);
      scrollItemIntoView((selectedIndex - 1 + filteredResults.length) % filteredResults.length);
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredResults[selectedIndex];
      if (selected) {
        handleOpenItem(selected);
      }
    }
  };

  const scrollItemIntoView = (index: number) => {
    if (!listRef.current) return;
    const items = listRef.current.querySelectorAll('[data-search-item]');
    if (items[index]) {
      items[index].scrollIntoView({ block: 'nearest', behavior: 'smooth' });
    }
  };

  const handleOpenItem = (item: SearchableItem) => {
    const link = driveLinks[item.driveKey];
    if (link) {
      window.open(link, '_blank', 'noopener,noreferrer');
    } else {
      alert("📂 Le dossier Drive demandé est en cours de centralisation.\nIl sera disponible très prochainement !");
    }
  };

  const handleNavigatePage = (item: SearchableItem, e: React.MouseEvent) => {
    e.stopPropagation();
    if (item.pageTarget) {
      setCurrentPage(item.pageTarget);
      if (item.filiereTarget && onSelectFiliere) {
        onSelectFiliere(item.filiereTarget);
      }
      onClose();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-[#171310]/70 backdrop-blur-md flex items-start justify-center p-3 sm:p-4 md:p-6 transition-all"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="search-modal-title"
    >
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl border border-[#E2E8F0] shadow-2xl overflow-hidden mt-6 sm:mt-12 flex flex-col max-h-[85vh] animate-in fade-in zoom-in-95 duration-150"
        onClick={e => e.stopPropagation()}
      >
        {/* Search Header Bar */}
        <div className="p-4 sm:p-5 border-b border-[#E2E8F0] bg-white">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-[#F1F5F9] text-brand flex-shrink-0">
              <Search className="h-5 w-5" />
            </div>

            <div className="relative flex-1">
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={e => setQuery(e.target.value)}
                onKeyDown={handleInputKeyDown}
                placeholder="Rechercher un cours, annale, TD, matière, rapport de stage..."
                className="w-full bg-transparent text-[#0F172A] placeholder:text-[#94A3B8] text-base sm:text-lg font-medium focus:outline-none pr-8"
                id="search-modal-title"
              />
              {query && (
                <button
                  onClick={() => setQuery('')}
                  className="absolute right-0 top-1/2 -translate-y-1/2 p-1 text-[#94A3B8] hover:text-[#0F172A] rounded-full cursor-pointer"
                  title="Effacer la recherche"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl text-[#94A3B8] hover:text-[#0F172A] hover:bg-[#F1F5F9] transition-colors cursor-pointer border border-transparent hover:border-[#E2E8F0]"
              aria-label="Fermer la recherche"
            >
              <kbd className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-mono font-bold bg-[#F1F5F9] text-[#64748B] rounded-md border border-[#E2E8F0] mr-1.5">
                ESC
              </kbd>
              <X className="h-5 w-5 inline-block sm:hidden" />
            </button>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-3 pb-0.5 no-scrollbar">
            {FILTER_CONFIG.map(filter => {
              const Icon = filter.icon;
              const isActive = activeFilter === filter.id;
              return (
                <button
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                    isActive 
                      ? 'bg-[#1B835E] text-white shadow-sm' 
                      : 'bg-[#F1F5F9] text-[#64748B] hover:text-[#0F172A] hover:bg-[#EFE6D8] border border-[#E2E8F0]/60'
                  }`}
                >
                  <Icon className={`h-3.5 w-3.5 ${isActive ? 'text-white' : 'text-[#94A3B8]'}`} />
                  <span>{filter.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Suggested Tags if query is empty */}
        {!query && (
          <div className="px-5 py-3 bg-[#F1F5F9]/60 border-b border-[#E2E8F0] flex items-center gap-2 overflow-x-auto text-xs text-[#64748B]">
            <span className="font-bold flex items-center gap-1 text-[11px] text-[#94A3B8] uppercase tracking-wider flex-shrink-0">
              <Sparkles className="h-3 w-3 text-brand" />
              Sujets fréquents :
            </span>
            <div className="flex items-center gap-1.5 flex-nowrap">
              {SUGGESTED_TAGS.map(tag => (
                <button
                  key={tag}
                  onClick={() => setQuery(tag)}
                  className="px-2.5 py-1 rounded-lg bg-white border border-[#E2E8F0] hover:border-brand text-[11px] font-medium text-[#334155] hover:text-brand transition-all cursor-pointer whitespace-nowrap"
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results List */}
        <div 
          ref={listRef}
          className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-2 max-h-[50vh]"
        >
          {filteredResults.length === 0 ? (
            <div className="py-12 px-4 text-center space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-[#F1F5F9] border border-[#E2E8F0] text-[#94A3B8] flex items-center justify-center mx-auto text-xl">
                🔎
              </div>
              <h3 className="font-serif text-lg font-bold text-[#0F172A]">
                Aucun document trouvé pour "{query}"
              </h3>
              <p className="text-xs text-[#64748B] max-w-md mx-auto leading-relaxed">
                Vérifiez l'orthographe ou essayez un mot plus général (ex: "Maths", "Béton", "S2", "GEE"). Vous pouvez aussi déposer ce document s'il manque !
              </p>
              <div className="pt-2">
                <button
                  onClick={() => {
                    setCurrentPage('contribuer');
                    onClose();
                  }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-brand text-white text-xs font-bold rounded-xl hover:bg-brand-hover transition-all cursor-pointer"
                >
                  <span>Proposer un document manquant</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-2 text-[11px] font-bold uppercase tracking-wider text-[#94A3B8]">
                <span>{query ? `Résultats (${filteredResults.length})` : 'Documents suggérés'}</span>
                <span className="hidden sm:inline">Naviguez avec ↑ ↓ et Entrée ↵</span>
              </div>

              {filteredResults.map((item, index) => {
                const isSelected = index === selectedIndex;
                const categoryConfig = FILTER_CONFIG.find(f => f.id === item.category) || FILTER_CONFIG[0];
                const ItemIcon = categoryConfig.icon;

                return (
                  <div
                    key={item.id}
                    data-search-item
                    onClick={() => handleOpenItem(item)}
                    onMouseEnter={() => setSelectedIndex(index)}
                    className={`group p-3.5 sm:p-4 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected 
                        ? 'bg-white border-brand shadow-[0_4px_16px_rgba(27,131,94,0.1)]' 
                        : 'bg-white/70 border-[#E2E8F0] hover:bg-white'
                    }`}
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      <div className={`p-2.5 rounded-xl flex-shrink-0 mt-0.5 ${
                        item.category === 'examens' 
                          ? 'bg-[#FCE8E6] text-gee' 
                          : item.category === 'rapports' 
                          ? 'bg-[#E1EEF9] text-geaah' 
                          : item.category === 'bibliotheque' 
                          ? 'bg-[#FEF8ED] text-gc' 
                          : 'bg-[#EAF5EE] text-brand'
                      }`}>
                        <ItemIcon className="h-4 w-4" />
                      </div>

                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-semibold text-sm sm:text-base text-[#0F172A] group-hover:text-brand transition-colors truncate">
                            {item.title}
                          </h4>
                          <span className="px-2 py-0.5 rounded-md bg-[#F1F5F9] text-[#64748B] text-[10px] font-bold uppercase tracking-wider border border-[#E2E8F0]">
                            {item.filiereOrLevel}
                          </span>
                        </div>
                        <p className="text-xs text-[#64748B] line-clamp-1 leading-relaxed">
                          {item.description}
                        </p>
                      </div>
                    </div>

                    {/* Actions buttons */}
                    <div className="flex items-center gap-2 flex-shrink-0 self-end sm:self-center pt-2 sm:pt-0">
                      {item.pageTarget && (
                        <button
                          onClick={(e) => handleNavigatePage(item, e)}
                          className="px-2.5 py-1.5 rounded-xl bg-[#F1F5F9] hover:bg-[#EFE6D8] text-[#334155] text-xs font-semibold transition-all border border-[#E2E8F0] flex items-center gap-1 cursor-pointer"
                          title="Aller à la page dédiée dans archiv2ie"
                        >
                          <span>Voir la page</span>
                          <ArrowRight className="h-3 w-3" />
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenItem(item)}
                        className="px-3 py-1.5 rounded-xl bg-brand hover:bg-brand-hover text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1.5 cursor-pointer"
                        title="Ouvrir le dossier Drive associé"
                      >
                        <span>Drive</span>
                        <ExternalLink className="h-3 w-3" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:px-5 sm:py-3.5 bg-white border-t border-[#E2E8F0] flex flex-wrap items-center justify-between gap-2 text-xs text-[#94A3B8]">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#E2E8F0] font-mono text-[10px] text-[#64748B]">↑</kbd>
              <kbd className="px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#E2E8F0] font-mono text-[10px] text-[#64748B]">↓</kbd>
              <span className="hidden sm:inline">Naviguer</span>
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-1.5 py-0.5 rounded bg-[#F1F5F9] border border-[#E2E8F0] font-mono text-[10px] text-[#64748B]">↵</kbd>
              <span className="hidden sm:inline">Ouvrir</span>
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-brand font-medium text-[11px]">
            <CheckCircle2 className="h-3.5 w-3.5" />
            <span>{allSearchableItems.length} ressources indexées</span>
          </div>
        </div>

      </div>
    </div>
  );
}

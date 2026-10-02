import React, { useState } from 'react';
import { Page } from '../types';
import { 
  GraduationCap, 
  Menu, 
  X, 
  ChevronDown, 
  BookOpen, 
  HardHat, 
  Zap, 
  Droplet, 
  Library, 
  FileText, 
  Info, 
  Search,
  User as UserIcon
} from 'lucide-react';
import logoImg from '../assets/images/logo_2ie_1783052694775.jpg';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onSelectFiliere?: (filiereKey: 'gee' | 'gc-btp' | 'geaah') => void;
  onOpenSearch?: () => void;
}

export default function Header({ 
  currentPage, 
  setCurrentPage, 
  onSelectFiliere, 
  onOpenSearch
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleFiliereClick = (key: 'gee' | 'gc-btp' | 'geaah') => {
    setCurrentPage('filieres');
    if (onSelectFiliere) {
      onSelectFiliere(key);
    }
    setMobileMenuOpen(false);
    setDropdownOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="site-header sticky top-0 z-50 glass-warm border-b border-[#E2E8F0] shadow-[0_2px_12px_rgba(40,30,20,0.03)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <button 
            onClick={() => handlePageChange('home')}
            className="flex items-center gap-2.5 text-left group transition-transform focus:outline-none cursor-pointer"
            id="logo-button"
          >
            <div className="p-1 bg-white rounded-xl shadow-sm border border-[#E2E8F0] flex items-center justify-center h-10 w-10 overflow-hidden group-hover:scale-105 transition-transform duration-200">
              <img 
                src={logoImg} 
                alt="Logo 2iE" 
                className="h-full w-full object-contain scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-[#0F172A] block leading-tight">
                archiv<span className="text-[#0284C7]">2ie</span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <button
              onClick={() => handlePageChange('home')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                currentPage === 'home' 
                  ? 'bg-[#1B835E]/10 text-[#1B835E] font-semibold' 
                  : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              Accueil
            </button>

            <button
              onClick={() => handlePageChange('tronc-commun')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                currentPage === 'tronc-commun' 
                  ? 'bg-[#1B835E]/10 text-[#1B835E] font-semibold' 
                  : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              Tronc Commun
            </button>

            {/* Dropdown for branches */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={() => setDropdownOpen(true)}
                className={`px-3.5 py-2 rounded-xl text-sm font-medium flex items-center gap-1 transition-all cursor-pointer ${
                  currentPage === 'filieres' 
                    ? 'bg-[#1B835E]/10 text-[#1B835E] font-semibold' 
                    : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
                }`}
              >
                Filières Spécialisées
                <ChevronDown className="h-4 w-4 transition-transform duration-200 text-[#94A3B8]" />
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-1.5 w-72 rounded-2xl bg-white p-2.5 shadow-xl border border-[#E2E8F0] ring-1 ring-black/5"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    onClick={() => handleFiliereClick('gee')}
                    className="flex w-full items-start gap-3 rounded-xl p-2.5 text-left hover:bg-[#FDF2F0] transition-all text-[#4A423B] hover:text-gee cursor-pointer"
                  >
                    <div className="p-1.5 bg-[#FCE8E6] text-gee rounded-lg mt-0.5">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-[#0F172A]">Filière GEE</div>
                      <div className="text-[10px] text-[#7A7167] mt-0.5">Génie Électrique & Énergétique</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleFiliereClick('gc-btp')}
                    className="flex w-full items-start gap-3 rounded-xl p-2.5 text-left hover:bg-[#FEF8ED] transition-all text-[#4A423B] hover:text-gc cursor-pointer"
                  >
                    <div className="p-1.5 bg-[#FDF0D9] text-gc rounded-lg mt-0.5">
                      <HardHat className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-[#0F172A]">Filière GC-BTP</div>
                      <div className="text-[10px] text-[#7A7167] mt-0.5">Génie Civil & Bâtiment Travaux Publics</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleFiliereClick('geaah')}
                    className="flex w-full items-start gap-3 rounded-xl p-2.5 text-left hover:bg-[#F0F6FC] transition-all text-[#4A423B] hover:text-geaah cursor-pointer"
                  >
                    <div className="p-1.5 bg-[#E1EEF9] text-geaah rounded-lg mt-0.5">
                      <Droplet className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-[#0F172A]">Filière GEAAH</div>
                      <div className="text-[10px] text-[#7A7167] mt-0.5">Génie Eau, Assainissement & AH</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handlePageChange('bibliotheque')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                currentPage === 'bibliotheque' 
                  ? 'bg-[#1B835E]/10 text-[#1B835E] font-semibold' 
                  : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              Bibliothèque
            </button>

            <button
              onClick={() => handlePageChange('rapports')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                currentPage === 'rapports' 
                  ? 'bg-[#1B835E]/10 text-[#1B835E] font-semibold' 
                  : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              Stages & PFE
            </button>

            <button
              onClick={() => handlePageChange('about')}
              className={`px-3.5 py-2 rounded-xl text-sm font-medium transition-all cursor-pointer ${
                currentPage === 'about' 
                  ? 'bg-[#1B835E]/10 text-[#1B835E] font-semibold' 
                  : 'text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A]'
              }`}
            >
              À Propos
            </button>

            {/* Universal Search Button (Desktop) */}
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-2 rounded-xl text-[#64748B] hover:bg-[#F1F5F9] hover:text-[#0F172A] transition-all cursor-pointer border border-transparent hover:border-[#E2E8F0]"
                title="Rechercher un cours, annale ou rapport (Ctrl + K)"
                aria-label="Rechercher"
              >
                <Search className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={() => handlePageChange('contribuer')}
              className="ml-2 px-4 py-2 rounded-full text-xs font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-sm hover:shadow transition-all transform hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              Contribuer 📤
            </button>
          </nav>

          {/* Mobile Right Controls: Search & Hamburger */}
          <div className="md:hidden flex items-center gap-1">
            {onOpenSearch && (
              <button
                onClick={onOpenSearch}
                className="p-2 rounded-xl text-[#64748B] hover:bg-[#F1F5F9] focus:outline-none cursor-pointer"
                aria-label="Recherche universelle"
                title="Recherche universelle"
              >
                <Search className="h-5 w-5 text-brand" />
              </button>
            )}

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-[#64748B] hover:bg-[#F1F5F9] focus:outline-none cursor-pointer"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-[#E2E8F0] bg-white px-4 py-4 space-y-2 shadow-inner">

          {onOpenSearch && (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenSearch();
              }}
              className="flex w-full items-center justify-between px-4 py-3 rounded-2xl bg-[#F1F5F9] text-[#0F172A] border border-[#E2E8F0] text-sm font-semibold mb-2 shadow-2xs cursor-pointer"
            >
              <span className="flex items-center gap-2.5">
                <Search className="h-4 w-4 text-brand" />
                <span>Recherche universelle</span>
              </span>
              <kbd className="px-2 py-0.5 text-[10px] font-mono bg-white text-[#94A3B8] rounded border border-[#E2E8F0]">
                Ouvrir
              </kbd>
            </button>
          )}

          <button
            onClick={() => handlePageChange('home')}
            className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
              currentPage === 'home' ? 'bg-[#1B835E]/10 text-[#1B835E] font-semibold' : 'text-[#64748B] hover:bg-[#F1F5F9]'
            }`}
          >
            Accueil
          </button>
          <button
            onClick={() => handlePageChange('tronc-commun')}
            className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
              currentPage === 'tronc-commun' ? 'bg-[#1B835E]/10 text-[#1B835E] font-semibold' : 'text-[#64748B] hover:bg-[#F1F5F9]'
            }`}
          >
            Tronc Commun (S1 - S4)
          </button>

          {/* Branches details inside mobile menu */}
          <div className="px-4 py-2 border-l-2 border-brand/30 ml-2 space-y-1">
            <div className="text-[10px] font-bold tracking-wider text-[#94A3B8] uppercase mb-1">
              Spécialités S5 - S9
            </div>
            <button
              onClick={() => handleFiliereClick('gee')}
              className="flex w-full items-center gap-2 py-1.5 text-xs text-[#4A423B] hover:text-gee font-medium"
            >
              <Zap className="h-3.5 w-3.5 text-gee" /> GEE (Électricité & Énergies)
            </button>
            <button
              onClick={() => handleFiliereClick('gc-btp')}
              className="flex w-full items-center gap-2 py-1.5 text-xs text-[#4A423B] hover:text-gc font-medium"
            >
              <HardHat className="h-3.5 w-3.5 text-gc" /> GC-BTP (Bâtiment & TP)
            </button>
            <button
              onClick={() => handleFiliereClick('geaah')}
              className="flex w-full items-center gap-2 py-1.5 text-xs text-[#4A423B] hover:text-geaah font-medium"
            >
              <Droplet className="h-3.5 w-3.5 text-geaah" /> GEAAH (Eau & Assainissement)
            </button>
          </div>

          <button
            onClick={() => handlePageChange('bibliotheque')}
            className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
              currentPage === 'bibliotheque' ? 'bg-[#1B835E]/10 text-[#1B835E] font-semibold' : 'text-[#64748B] hover:bg-[#F1F5F9]'
            }`}
          >
            Bibliothèque Numérique
          </button>
          <button
            onClick={() => handlePageChange('rapports')}
            className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
              currentPage === 'rapports' ? 'bg-[#1B835E]/10 text-[#1B835E] font-semibold' : 'text-[#64748B] hover:bg-[#F1F5F9]'
            }`}
          >
            Rapports de Stage & PFE
          </button>
          <button
            onClick={() => handlePageChange('about')}
            className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
              currentPage === 'about' ? 'bg-[#1B835E]/10 text-[#1B835E] font-semibold' : 'text-[#64748B] hover:bg-[#F1F5F9]'
            }`}
          >
            À Propos
          </button>

          <button
            onClick={() => handlePageChange('contribuer')}
            className="flex w-full justify-center items-center gap-2 px-4 py-3 rounded-full text-sm font-bold text-white bg-[#0284C7] hover:bg-[#0369A1] shadow-sm mt-4 cursor-pointer"
          >
            📤 Déposer un document
          </button>
        </div>
      )}
    </header>
  );
}

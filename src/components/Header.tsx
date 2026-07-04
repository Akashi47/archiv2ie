import React, { useState } from 'react';
import { Page } from '../types';
import { GraduationCap, Menu, X, ChevronDown, BookOpen, HardHat, Zap, Droplet, Library, FileText, Info } from 'lucide-react';
import logoImg from '../assets/images/logo_2ie_1783052694775.jpg';

interface HeaderProps {
  currentPage: Page;
  setCurrentPage: (page: Page) => void;
  onSelectFiliere?: (filiereKey: 'gee' | 'gc-btp' | 'geaah') => void;
}

export default function Header({ currentPage, setCurrentPage, onSelectFiliere }: HeaderProps) {
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
    <header className="site-header sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100 shadow-sm">
      {/* 2iE Tricolor Bar */}
      <div className="flex h-1.5 w-full">
        <div className="flex-1 bg-gee" />
        <div className="flex-1 bg-gc" />
        <div className="flex-1 bg-geaah" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <button 
            onClick={() => handlePageChange('home')}
            className="flex items-center gap-2.5 text-left group transition-transform focus:outline-none"
            id="logo-button"
          >
            <div className="p-1 bg-white rounded-xl shadow-sm border border-gray-100 flex items-center justify-center h-10 w-10 overflow-hidden group-hover:scale-105 transition-transform duration-200">
              <img 
                src={logoImg} 
                alt="Logo 2iE" 
                className="h-full w-full object-contain scale-110"
                referrerPolicy="no-referrer"
              />
            </div>
            <div>
              <span className="font-serif text-2xl font-bold tracking-tight text-gray-900 block leading-tight">
                archiv<span className="text-brand">2ie</span>
              </span>
            </div>
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-3">
            <button
              onClick={() => handlePageChange('home')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'home' 
                  ? 'bg-brand/10 text-brand' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Accueil
            </button>

            <button
              onClick={() => handlePageChange('tronc-commun')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'tronc-commun' 
                  ? 'bg-brand/10 text-brand' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Tronc Commun
            </button>

            {/* Dropdown for branches */}
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                onMouseEnter={() => setDropdownOpen(true)}
                className={`px-3 py-2 rounded-lg text-sm font-medium flex items-center gap-1 transition-all ${
                  currentPage === 'filieres' 
                    ? 'bg-brand/10 text-brand' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                Filières Spécialisées
                <ChevronDown className="h-4 w-4 transition-transform duration-200" />
              </button>

              {dropdownOpen && (
                <div 
                  className="absolute right-0 mt-1 w-72 rounded-xl bg-white p-2 shadow-xl border border-gray-100 ring-1 ring-black/5"
                  onMouseLeave={() => setDropdownOpen(false)}
                >
                  <button
                    onClick={() => handleFiliereClick('gee')}
                    className="flex w-full items-start gap-3 rounded-lg p-2.5 text-left hover:bg-red-50/50 transition-all text-gray-700 hover:text-gee"
                  >
                    <div className="p-1.5 bg-red-100 text-gee rounded-lg mt-0.5">
                      <Zap className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-gray-900">Filière GEE</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">Génie Électrique & Énergétique</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleFiliereClick('gc-btp')}
                    className="flex w-full items-start gap-3 rounded-lg p-2.5 text-left hover:bg-amber-50/50 transition-all text-gray-700 hover:text-gc"
                  >
                    <div className="p-1.5 bg-amber-100 text-gc rounded-lg mt-0.5">
                      <HardHat className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-gray-900">Filière GC-BTP</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">Génie Civil & Bâtiment Travaux Publics</div>
                    </div>
                  </button>

                  <button
                    onClick={() => handleFiliereClick('geaah')}
                    className="flex w-full items-start gap-3 rounded-lg p-2.5 text-left hover:bg-blue-50/50 transition-all text-gray-700 hover:text-geaah"
                  >
                    <div className="p-1.5 bg-blue-100 text-geaah rounded-lg mt-0.5">
                      <Droplet className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="font-semibold text-xs text-gray-900">Filière GEAAH</div>
                      <div className="text-[10px] text-gray-500 mt-0.5">Génie Eau, Assainissement & AH</div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <button
              onClick={() => handlePageChange('bibliotheque')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'bibliotheque' 
                  ? 'bg-brand/10 text-brand' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Bibliothèque
            </button>

            <button
              onClick={() => handlePageChange('rapports')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'rapports' 
                  ? 'bg-brand/10 text-brand' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              Stages & PFE
            </button>

            <button
              onClick={() => handlePageChange('about')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                currentPage === 'about' 
                  ? 'bg-brand/10 text-brand' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              }`}
            >
              À Propos
            </button>

            <button
              onClick={() => handlePageChange('contribuer')}
              className={`ml-2 px-4 py-2 rounded-full text-sm font-bold text-white bg-brand hover:bg-brand-hover shadow-md hover:shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0`}
            >
              Contribuer 📤
            </button>
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl text-gray-600 hover:bg-gray-50 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white px-4 py-4 space-y-2 shadow-inner">
          <button
            onClick={() => handlePageChange('home')}
            className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
              currentPage === 'home' ? 'bg-brand/10 text-brand' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Accueil
          </button>
          <button
            onClick={() => handlePageChange('tronc-commun')}
            className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
              currentPage === 'tronc-commun' ? 'bg-brand/10 text-brand' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Tronc Commun (S1 - S4)
          </button>

          {/* Branches details inside mobile menu */}
          <div className="px-4 py-2 border-l-2 border-brand/20 ml-2 space-y-1">
            <div className="text-[10px] font-bold tracking-wider text-gray-400 uppercase mb-1">
              Spécialités S5 - S9
            </div>
            <button
              onClick={() => handleFiliereClick('gee')}
              className="flex w-full items-center gap-2 py-1.5 text-xs text-gray-600 hover:text-gee font-medium"
            >
              <Zap className="h-3.5 w-3.5 text-gee" /> GEE (Électricité & Énergies)
            </button>
            <button
              onClick={() => handleFiliereClick('gc-btp')}
              className="flex w-full items-center gap-2 py-1.5 text-xs text-gray-600 hover:text-gc font-medium"
            >
              <HardHat className="h-3.5 w-3.5 text-gc" /> GC-BTP (Bâtiment & TP)
            </button>
            <button
              onClick={() => handleFiliereClick('geaah')}
              className="flex w-full items-center gap-2 py-1.5 text-xs text-gray-600 hover:text-geaah font-medium"
            >
              <Droplet className="h-3.5 w-3.5 text-geaah" /> GEAAH (Eau & Assainissement)
            </button>
          </div>

          <button
            onClick={() => handlePageChange('bibliotheque')}
            className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
              currentPage === 'bibliotheque' ? 'bg-brand/10 text-brand' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Bibliothèque Numérique
          </button>
          <button
            onClick={() => handlePageChange('rapports')}
            className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
              currentPage === 'rapports' ? 'bg-brand/10 text-brand' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            Rapports de Stage & PFE
          </button>
          <button
            onClick={() => handlePageChange('about')}
            className={`flex w-full items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium ${
              currentPage === 'about' ? 'bg-brand/10 text-brand' : 'text-gray-600 hover:bg-gray-50'
            }`}
          >
            À Propos
          </button>
          <button
            onClick={() => handlePageChange('contribuer')}
            className="flex w-full justify-center items-center gap-2 px-4 py-3 rounded-full text-sm font-bold text-white bg-brand hover:bg-brand-hover shadow-md shadow-brand/10 mt-4"
          >
            📤 Déposer un document
          </button>
        </div>
      )}
    </header>
  );
}

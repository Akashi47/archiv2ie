import React from 'react';
import { Page } from '../types';
import { GraduationCap, Heart, HelpCircle, FileText, Share2, Mail, ExternalLink, Info } from 'lucide-react';
import logoImg from '../assets/images/logo_2ie_1783052694775.jpg';

interface FooterProps {
  setCurrentPage: (page: Page) => void;
}

export default function Footer({ setCurrentPage }: FooterProps) {
  const handlePageChange = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-gray-900 text-gray-400 border-t border-gray-800">
      
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo and brief info */}
          <div className="md:col-span-1.5 space-y-4">
            <div className="flex items-center gap-2.5 text-left">
              <div className="p-1 bg-white rounded-lg h-8 w-8 flex items-center justify-center overflow-hidden">
                <img 
                  src={logoImg} 
                  alt="Logo 2iE" 
                  className="h-full w-full object-contain scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-serif text-xl font-bold tracking-tight text-white">
                archiv<span className="text-brand">2ie</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed max-w-sm">
              Plateforme collaborative d'archivage numérique conçue par et pour les étudiants de l'Institut 2iE. Accédez librement aux cours, TD, examens, ainsi qu'aux rapports de stage d'excellence.
            </p>

          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handlePageChange('home')} className="hover:text-brand transition-all">
                  Accueil du portail
                </button>
              </li>
              <li>
                <button onClick={() => handlePageChange('tronc-commun')} className="hover:text-brand transition-all">
                  Tronc Commun (S1 - S4)
                </button>
              </li>
              <li>
                <button onClick={() => handlePageChange('bibliotheque')} className="hover:text-brand transition-all">
                  Bibliothèque numérique
                </button>
              </li>
              <li>
                <button onClick={() => handlePageChange('rapports')} className="hover:text-brand transition-all">
                  Rapports de Stage & PFE
                </button>
              </li>
            </ul>
          </div>

          {/* Spécialités direct link */}
          <div>
            <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4">Branches S5 - S9</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handlePageChange('filieres')} className="hover:text-brand transition-all flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-gee rounded-full" /> GEE (Électrique & Énergie)
                </button>
              </li>
              <li>
                <button onClick={() => handlePageChange('filieres')} className="hover:text-brand transition-all flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-gc rounded-full" /> GC-BTP (Génie Civil & BTP)
                </button>
              </li>
              <li>
                <button onClick={() => handlePageChange('filieres')} className="hover:text-brand transition-all flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 bg-geaah rounded-full" /> GEAAH (Eau, Assain. & AH)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div>
            <h4 className="text-sm font-bold text-gray-200 uppercase tracking-wider mb-4">Support & Liens</h4>
            <ul className="space-y-3 text-xs">
              <li>
                <button onClick={() => handlePageChange('about')} className="hover:text-brand transition-all flex items-center gap-1.5">
                  <Info className="h-3.5 w-3.5" /> À Propos du Projet
                </button>
              </li>
              <li>
                <button onClick={() => handlePageChange('contribuer')} className="hover:text-brand transition-all flex items-center gap-1.5">
                  <Share2 className="h-3.5 w-3.5" /> Guide du Contributeur
                </button>
              </li>
              <li>
                <a 
                  href="http://documentation.2ie-edu.org/cdi2ie/opac_css/index.php" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-brand transition-all flex items-center gap-1 text-gray-400"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Catalogue CDI Physique (OPAC)
                </a>
              </li>
              <li className="pt-2">
                <a 
                  href="mailto:eyuaelijah@gmail.com" 
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-gray-800 text-gray-200 hover:text-white transition-all hover:bg-gray-700"
                >
                  <Mail className="h-3.5 w-3.5 text-brand" />
                  <span>Contact technique</span>
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Lower Copyright section */}
      <div className="bg-gray-950 py-6 border-t border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-500">
          <div>
            <span>archiv2ie © 2026 · Tous droits réservés. Développé pour la communauté estudiantine de 2iE.</span>
          </div>
          <div className="flex gap-4">
            <a href="https://akashi47.github.io/archiv2ie/" className="hover:underline">Site Original</a>
            <span>·</span>
            <span>Version Interactive React</span>
          </div>
        </div>
      </div>

    </footer>
  );
}

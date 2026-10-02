import React from 'react';
import { Page } from '../types';
import { GraduationCap, Heart, HelpCircle, FileText, Share2, Mail, ExternalLink, Info, Send } from 'lucide-react';
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
    <footer className="bg-[#0F2236] text-[#A8C2D8] border-t border-[#1E3B5C]">
      
      {/* Upper Footer section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Logo and brief info */}
          <div className="md:col-span-1.5 space-y-4">
            <div className="flex items-center gap-2.5 text-left">
              <div className="p-1 bg-white rounded-xl h-9 w-9 flex items-center justify-center overflow-hidden border border-white/20 shadow-sm">
                <img 
                  src={logoImg} 
                  alt="Logo 2iE" 
                  className="h-full w-full object-contain scale-110"
                  referrerPolicy="no-referrer"
                />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                archiv<span className="text-[#38BDF8]">2ie</span>
              </span>
            </div>
            <p className="text-xs text-[#A8C2D8] leading-relaxed max-w-sm">
              Plateforme collaborative d'archivage numérique conçue par et pour les étudiants de l'Institut 2iE. Accédez librement aux cours, TD, examens, ainsi qu'aux rapports de stage et PFE.
            </p>
          </div>

          {/* Quick links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Navigation</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handlePageChange('home')} className="hover:text-white transition-all cursor-pointer">
                  Accueil du portail
                </button>
              </li>
              <li>
                <button onClick={() => handlePageChange('tronc-commun')} className="hover:text-white transition-all cursor-pointer">
                  Tronc Commun (S1 - S4)
                </button>
              </li>
              <li>
                <button onClick={() => handlePageChange('bibliotheque')} className="hover:text-white transition-all cursor-pointer">
                  Bibliothèque numérique
                </button>
              </li>
              <li>
                <button onClick={() => handlePageChange('rapports')} className="hover:text-white transition-all cursor-pointer">
                  Rapports de Stage & PFE
                </button>
              </li>
            </ul>
          </div>

          {/* Spécialités direct link */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Branches S5 - S9</h4>
            <ul className="space-y-2.5 text-xs">
              <li>
                <button onClick={() => handlePageChange('filieres')} className="hover:text-white transition-all flex items-center gap-2 cursor-pointer">
                  <span className="h-2 w-2 bg-gee rounded-full" /> GEE (Électrique & Énergie)
                </button>
              </li>
              <li>
                <button onClick={() => handlePageChange('filieres')} className="hover:text-white transition-all flex items-center gap-2 cursor-pointer">
                  <span className="h-2 w-2 bg-gc rounded-full" /> GC-BTP (Génie Civil & BTP)
                </button>
              </li>
              <li>
                <button onClick={() => handlePageChange('filieres')} className="hover:text-white transition-all flex items-center gap-2 cursor-pointer">
                  <span className="h-2 w-2 bg-[#38BDF8] rounded-full" /> GEAAH (Eau, Assain. & AH)
                </button>
              </li>
            </ul>
          </div>

          {/* Contact / Help */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-widest mb-4">Support & Concepteur</h4>
            <ul className="space-y-3 text-xs">
              <li>
                <button onClick={() => handlePageChange('about')} className="hover:text-white transition-all flex items-center gap-1.5 cursor-pointer">
                  <Info className="h-3.5 w-3.5" /> À Propos du Projet
                </button>
              </li>
              <li>
                <button onClick={() => handlePageChange('contribuer')} className="hover:text-white transition-all flex items-center gap-1.5 cursor-pointer">
                  <Share2 className="h-3.5 w-3.5" /> Guide du Contributeur
                </button>
              </li>
              <li>
                <a 
                  href="http://documentation.2ie-edu.org/cdi2ie/opac_css/index.php" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="hover:text-white transition-all flex items-center gap-1 text-[#A8C2D8]"
                >
                  <ExternalLink className="h-3.5 w-3.5" /> Catalogue CDI (OPAC)
                </a>
              </li>
              <li className="pt-2 flex flex-col gap-2">
                <a 
                  href="https://t.me/eyuaelie" 
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#193755] text-slate-100 hover:text-white transition-all hover:bg-[#20456B] border border-[#274D75]"
                >
                  <Send className="h-3.5 w-3.5 text-[#38BDF8]" />
                  <span>Telegram : @eyuaelie</span>
                </a>
              </li>
            </ul>
          </div>

        </div>
      </div>

      {/* Lower Copyright section */}
      <div className="bg-[#0A1827] py-6 border-t border-[#18314A]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-[#7B99B5]">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 text-center sm:text-left">
            <span>archiv2ie © 2026 · Tous droits réservés.</span>
          </div>
          <div className="flex items-center gap-3">
            <a href="https://akashi47.github.io/archiv2ie/" target="_blank" rel="noopener noreferrer" className="hover:underline hover:text-white">Site Original</a>
            <span>·</span>
            <span className="text-[#38BDF8] font-medium">archiv2ie React</span>
          </div>
        </div>
      </div>

    </footer>
  );
}

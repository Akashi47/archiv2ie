import React, { useState, useEffect } from 'react';
import { Page, FiliereKey } from './types';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import TroncCommun from './components/TroncCommun';
import Filieres from './components/Filieres';
import Bibliotheque from './components/Bibliotheque';
import Rapports from './components/Rapports';
import Contribuer from './components/Contribuer';
import About from './components/About';
import UniversalSearchModal from './components/UniversalSearchModal';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedFiliere, setSelectedFiliere] = useState<FiliereKey>('gee');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Ensure single light mode and clear any legacy preferences
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    try {
      localStorage.removeItem('archiv2ie_theme');
      localStorage.removeItem('archiv2ie_local_favorites');
    } catch {
      // ignore
    }
  }, []);

  // Global keyboard shortcuts (Ctrl+K, Cmd+K, /)
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      // Cmd/Ctrl + K
      if ((e.metaKey || e.ctrlKey) && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault();
        setIsSearchOpen(prev => !prev);
        return;
      }

      // Quick slash / shortcut when not in input or textarea
      if (e.key === '/' && !['INPUT', 'TEXTAREA', 'SELECT'].includes((e.target as HTMLElement)?.tagName)) {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };

    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <Home 
            setCurrentPage={setCurrentPage} 
            setSelectedFiliere={setSelectedFiliere}
          />
        );
      case 'tronc-commun':
        return <TroncCommun />;
      case 'filieres':
        return (
          <Filieres 
            selectedFiliere={selectedFiliere} 
            setSelectedFiliere={setSelectedFiliere}
          />
        );
      case 'bibliotheque':
        return <Bibliotheque />;
      case 'rapports':
        return <Rapports />;
      case 'contribuer':
        return <Contribuer />;
      case 'about':
        return <About />;
      default:
        return (
          <Home 
            setCurrentPage={setCurrentPage} 
            setSelectedFiliere={setSelectedFiliere}
          />
        );
    }
  };

  return (
    <div className="min-h-screen human-canvas text-[#1E293B] font-sans flex flex-col justify-between" id="app-container">
      <div>
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          onSelectFiliere={setSelectedFiliere}
          onOpenSearch={() => setIsSearchOpen(true)}
        />
        
        <main className="min-h-[calc(100vh-16rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25, ease: 'easeInOut' }}
            >
              {renderPage()}
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <Footer setCurrentPage={setCurrentPage} />

      {/* Universal Search Modal */}
      <UniversalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        setCurrentPage={setCurrentPage}
        onSelectFiliere={setSelectedFiliere}
      />
    </div>
  );
}

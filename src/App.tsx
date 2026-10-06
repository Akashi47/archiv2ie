import React, { useState, useEffect, useCallback } from 'react';
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

function parseHash(hash: string): { page: Page; filiere?: FiliereKey } {
  const clean = hash ? hash.replace(/^#\/?/, '').trim() : '';
  if (!clean || clean === 'home') {
    return { page: 'home' };
  }

  const [routePart, queryPart] = clean.split('?');
  const validPages: Page[] = ['home', 'tronc-commun', 'filieres', 'bibliotheque', 'rapports', 'contribuer', 'about'];

  let matchedPage: Page = 'home';
  if (validPages.includes(routePart as Page)) {
    matchedPage = routePart as Page;
  }

  let matchedFiliere: FiliereKey | undefined = undefined;
  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    const f = params.get('filiere');
    if (f === 'gee' || f === 'gc-btp' || f === 'geaah') {
      matchedFiliere = f;
    }
  }

  return { page: matchedPage, filiere: matchedFiliere };
}

function buildHash(page: Page, filiere?: FiliereKey): string {
  if (page === 'home') return '#home';
  if (page === 'filieres' && filiere) {
    return `#filieres?filiere=${filiere}`;
  }
  return `#${page}`;
}

export default function App() {
  const initial = parseHash(typeof window !== 'undefined' ? window.location.hash : '');
  const [currentPage, setCurrentPage] = useState<Page>(initial.page);
  const [selectedFiliere, setSelectedFiliere] = useState<FiliereKey>(initial.filiere || 'gee');
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Centralized navigation with browser history pushState
  const navigateTo = useCallback((page: Page, filiere?: FiliereKey, replace: boolean = false) => {
    setCurrentPage(page);
    if (filiere) {
      setSelectedFiliere(filiere);
    }
    const targetFiliere = filiere || (page === 'filieres' ? selectedFiliere : undefined);
    const targetHash = buildHash(page, targetFiliere);

    if (window.location.hash !== targetHash) {
      if (replace) {
        window.history.replaceState({ page, filiere: targetFiliere }, '', targetHash);
      } else {
        window.history.pushState({ page, filiere: targetFiliere }, '', targetHash);
      }
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [selectedFiliere]);

  // Handle browser Back / Forward buttons (popstate & hashchange)
  useEffect(() => {
    if (!window.location.hash) {
      window.history.replaceState({ page: 'home' }, '', '#home');
    } else if (!window.history.state) {
      const init = parseHash(window.location.hash);
      window.history.replaceState(
        { page: init.page, filiere: init.filiere || 'gee' },
        '',
        buildHash(init.page, init.filiere || 'gee')
      );
    }

    const handleLocationChange = () => {
      const parsed = parseHash(window.location.hash);
      setCurrentPage(parsed.page);
      if (parsed.filiere) {
        setSelectedFiliere(parsed.filiere);
      }
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

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
            setCurrentPage={(p) => navigateTo(p)} 
            setSelectedFiliere={(f) => navigateTo('filieres', f)}
          />
        );
      case 'tronc-commun':
        return <TroncCommun />;
      case 'filieres':
        return (
          <Filieres 
            selectedFiliere={selectedFiliere} 
            setSelectedFiliere={(f) => navigateTo('filieres', f)}
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
            setCurrentPage={(p) => navigateTo(p)} 
            setSelectedFiliere={(f) => navigateTo('filieres', f)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen human-canvas text-[#1E293B] font-sans flex flex-col justify-between" id="app-container">
      <div>
        <Header 
          currentPage={currentPage} 
          setCurrentPage={(p) => navigateTo(p)} 
          onSelectFiliere={(f) => navigateTo('filieres', f)}
          onOpenSearch={() => setIsSearchOpen(true)}
        />

        <main className="min-h-[calc(100vh-16rem)]">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentPage + (currentPage === 'filieres' ? `-${selectedFiliere}` : '')}
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

      <Footer setCurrentPage={(p) => navigateTo(p)} />

      {/* Universal Search Modal */}
      <UniversalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        setCurrentPage={(p) => navigateTo(p)}
        onSelectFiliere={(f) => navigateTo('filieres', f)}
      />
    </div>
  );
}

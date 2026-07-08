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
import Admin from './components/Admin';
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedFiliere, setSelectedFiliere] = useState<FiliereKey>('gee');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('page') === 'admin' || params.get('admin') === 'true') {
      setCurrentPage('admin');
    }
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
        return <Contribuer setCurrentPage={setCurrentPage} />;
      case 'about':
        return <About />;
      case 'admin':
        return <Admin setCurrentPage={setCurrentPage} />;
      default:
        return <Home setCurrentPage={setCurrentPage} setSelectedFiliere={setSelectedFiliere} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/20 font-sans flex flex-col justify-between" id="app-container">
      <div>
        <Header 
          currentPage={currentPage} 
          setCurrentPage={setCurrentPage} 
          onSelectFiliere={setSelectedFiliere} 
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
    </div>
  );
}

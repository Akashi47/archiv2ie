import React, { useState } from 'react';
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
import { AnimatePresence, motion } from 'motion/react';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [selectedFiliere, setSelectedFiliere] = useState<FiliereKey>('gee');

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

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun } from 'lucide-react';
import { AppProvider, useApp } from './context/AppContext';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import Lessons from './pages/Lessons';
import Statistics from './pages/Statistics';
import Settings from './pages/Settings';

const AppContent = () => {
  const [currentPage, setCurrentPage] = useState('dashboard');
  const [darkMode, setDarkMode] = useState(true);
  const { settings, updateSettings } = useApp();

  useEffect(() => {
    setDarkMode(settings.darkMode);
    if (settings.darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const handleThemeToggle = () => {
    setDarkMode(!darkMode);
    updateSettings('darkMode', !darkMode);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard />;
      case 'flashcards':
        return <Flashcards />;
      case 'quiz':
        return <Quiz />;
      case 'lessons':
        return <Lessons />;
      case 'statistics':
        return <Statistics />;
      case 'settings':
        return <Settings onPageChange={setCurrentPage} />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'dark bg-gray-900' : 'bg-gray-50'
    }`}>
      {/* Header */}
      <header className="sticky top-0 z-50 bg-gray-800/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="text-3xl">📚</div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent">
              EnglishMaster
            </h1>
          </div>

          <button
            onClick={handleThemeToggle}
            className="p-2 rounded-lg bg-gray-700 hover:bg-gray-600 transition-colors"
            aria-label="Toggle theme"
          >
            {darkMode ? (
              <Sun size={20} className="text-yellow-400" />
            ) : (
              <Moon size={20} className="text-gray-700" />
            )}
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {renderPage()}
        </motion.div>
      </main>

      {/* Navigation */}
      <Navigation currentPage={currentPage} onPageChange={setCurrentPage} />

      {/* Footer */}
      <footer className="mt-16 border-t border-gray-700 py-8 text-center text-gray-400 text-sm">
        <p>© 2024 EnglishMaster. Learning English made fun and effective.</p>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

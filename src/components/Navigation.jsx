import React from 'react';
import { motion } from 'framer-motion';
import {
  Home,
  Book,
  HelpCircle,
  BarChart3,
  Settings,
  Zap,
} from 'lucide-react';

const Navigation = ({ currentPage, onPageChange }) => {
  const navItems = [
    { id: 'dashboard', label: 'Home', icon: Home },
    { id: 'lessons', label: 'Lessons', icon: Book },
    { id: 'flashcards', label: 'Cards', icon: Zap },
    { id: 'quiz', label: 'Quiz', icon: HelpCircle },
    { id: 'statistics', label: 'Stats', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-800/90 backdrop-blur-lg border-t border-gray-700">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-around items-center">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentPage === item.id;

            return (
              <motion.button
                key={item.id}
                onClick={() => onPageChange(item.id)}
                className={`flex flex-col items-center justify-center px-4 py-3 transition-colors relative ${
                  isActive
                    ? 'text-blue-400'
                    : 'text-gray-400 hover:text-white'
                }`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <Icon size={24} />
                <span className="text-xs mt-1 font-medium">{item.label}</span>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator"
                    className="absolute bottom-0 h-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-t-lg"
                    style={{ width: '100%' }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </motion.button>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navigation;

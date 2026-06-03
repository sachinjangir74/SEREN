import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X } from 'lucide-react';
import { AICompanionChat } from './AICompanionChat';

export const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Floating Action Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 z-50 p-4 bg-teal-600 text-white rounded-full shadow-2xl hover:bg-teal-700 transition-all transform hover:scale-105 ${
          isOpen ? 'scale-0 opacity-0 pointer-events-none' : 'scale-100 opacity-100'
        }`}
        aria-label="Open Seren AI Companion"
      >
        <MessageCircle className="w-6 h-6" />
      </button>

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-6 right-6 z-50 w-[90vw] md:w-auto overflow-hidden sm:bottom-6 sm:right-6 origin-bottom-right"
          >
            <div className="relative shadow-2xl rounded-2xl overflow-hidden border border-slate-200/50 dark:border-slate-800/50">
              <button
                onClick={() => setIsOpen(false)}
                className="absolute top-4 right-4 z-50 p-1 bg-black/10 hover:bg-black/20 rounded-full text-white transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
              <AICompanionChat />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

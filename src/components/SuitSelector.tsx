import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Suit, SUIT_SYMBOLS, SUIT_COLORS } from '../types';

interface SuitSelectorProps {
  onSelect: (suit: Suit) => void;
}

export const SuitSelector: React.FC<SuitSelectorProps> = ({ onSelect }) => {
  const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-zinc-900 p-8 rounded-3xl border border-white/10 shadow-2xl max-w-md w-full mx-4"
      >
        <h2 className="text-2xl font-serif italic text-center mb-6 text-white">Choose a New Suit</h2>
        <div className="grid grid-cols-2 gap-4">
          {suits.map((suit) => (
            <button
              key={suit}
              onClick={() => onSelect(suit)}
              className={`
                flex flex-col items-center justify-center p-6 rounded-2xl
                bg-white/5 hover:bg-white/10 border border-white/10
                transition-all duration-200 group
              `}
            >
              <span className={`text-5xl mb-2 ${SUIT_COLORS[suit]} group-hover:scale-110 transition-transform`}>
                {SUIT_SYMBOLS[suit]}
              </span>
              <span className="text-zinc-400 capitalize font-medium">{suit}</span>
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
};

import React from 'react';
import { motion } from 'framer-motion';
import { CardData, SUIT_SYMBOLS, SUIT_COLORS } from '../types';

interface CardProps {
  card: CardData;
  isFaceUp?: boolean;
  onClick?: () => void;
  isPlayable?: boolean;
  className?: string;
  index?: number;
}

export const Card: React.FC<CardProps> = ({ 
  card, 
  isFaceUp = true, 
  onClick, 
  isPlayable = false,
  className = "",
  index = 0
}) => {
  return (
    <motion.div
      layoutId={card.id}
      initial={{ scale: 0.8, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      whileHover={isPlayable ? { y: -20, scale: 1.05 } : {}}
      onClick={isPlayable ? onClick : undefined}
      className={`
        relative w-20 h-28 sm:w-24 sm:h-36 rounded-lg cursor-pointer select-none
        ${isFaceUp ? 'bg-white' : 'bg-blue-800'}
        ${isPlayable ? 'ring-4 ring-yellow-400 ring-offset-2 ring-offset-emerald-900 z-10' : 'card-shadow'}
        transition-shadow duration-200
        ${className}
      `}
    >
      {isFaceUp ? (
        <div className={`flex flex-col justify-between h-full p-1 sm:p-2 ${SUIT_COLORS[card.suit]}`}>
          <div className="flex flex-col items-start leading-none">
            <span className="text-sm sm:text-lg font-bold">{card.rank}</span>
            <span className="text-xs sm:text-sm">{SUIT_SYMBOLS[card.suit]}</span>
          </div>
          
          <div className="flex justify-center items-center text-2xl sm:text-4xl">
            {SUIT_SYMBOLS[card.suit]}
          </div>
          
          <div className="flex flex-col items-end leading-none rotate-180">
            <span className="text-sm sm:text-lg font-bold">{card.rank}</span>
            <span className="text-xs sm:text-sm">{SUIT_SYMBOLS[card.suit]}</span>
          </div>
        </div>
      ) : (
        <div className="w-full h-full flex items-center justify-center border-4 border-white/20 rounded-lg">
          <div className="w-4/5 h-4/5 border-2 border-white/10 rounded flex items-center justify-center">
            <div className="text-white/20 text-4xl">♠</div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

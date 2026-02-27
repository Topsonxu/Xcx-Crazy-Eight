import React from 'react';
import { motion } from 'framer-motion';
import { Layers, Play, Info, HelpCircle } from 'lucide-react';

interface StartScreenProps {
  onStart: () => void;
}

export const StartScreen: React.FC<StartScreenProps> = ({ onStart }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-emerald-950 p-4 felt-texture overflow-hidden"
    >
      {/* Decorative Cards in Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-10">
        <motion.div 
          animate={{ 
            rotate: [0, 360],
            x: [0, 100, 0],
            y: [0, -50, 0]
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-20 -left-20 w-64 h-96 bg-white rounded-2xl rotate-12"
        />
        <motion.div 
          animate={{ 
            rotate: [360, 0],
            x: [0, -100, 0],
            y: [0, 50, 0]
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-20 -right-20 w-64 h-96 bg-white rounded-2xl -rotate-12"
        />
      </div>

      <div className="relative z-10 max-w-2xl w-full">
        <div className="text-center mb-12">
          <motion.div
            initial={{ y: -20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-flex items-center justify-center w-24 h-24 bg-emerald-500/20 rounded-[2.5rem] border border-emerald-500/30 mb-8 shadow-2xl shadow-emerald-500/20"
          >
            <Layers size={48} className="text-emerald-400" />
          </motion.div>
          
          <motion.h1 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-6xl sm:text-8xl font-serif italic font-bold text-white mb-4 tracking-tighter"
          >
            Crazy Eights
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-emerald-300/60 uppercase tracking-[0.3em] font-bold text-sm"
          >
            The Ultimate Card Challenge
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-12">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="bg-black/20 backdrop-blur-md p-6 rounded-3xl border border-white/5"
          >
            <div className="flex items-center gap-3 mb-4 text-emerald-400">
              <HelpCircle size={20} />
              <h3 className="font-bold uppercase text-xs tracking-widest">How to Play</h3>
            </div>
            <ul className="text-zinc-400 text-sm space-y-3 text-left">
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                Match the suit or rank of the top card.
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                <span><strong className="text-white">8s are wild!</strong> Play them anytime to change the suit.</span>
              </li>
              <li className="flex gap-2">
                <span className="text-emerald-500 font-bold">•</span>
                Draw from the pile if you're stuck.
              </li>
            </ul>
          </motion.div>

          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="bg-black/20 backdrop-blur-md p-6 rounded-3xl border border-white/5"
          >
            <div className="flex items-center gap-3 mb-4 text-blue-400">
              <Info size={20} />
              <h3 className="font-bold uppercase text-xs tracking-widest">Objective</h3>
            </div>
            <p className="text-zinc-400 text-sm leading-relaxed text-left">
              Be the first player to empty your hand. Strategize your moves and use your wild 8s wisely to outsmart the AI opponent!
            </p>
            <div className="mt-4 pt-4 border-t border-white/5 flex justify-between items-center">
              <span className="text-[10px] text-zinc-500 uppercase font-mono">Difficulty</span>
              <span className="text-[10px] text-blue-400 uppercase font-bold px-2 py-0.5 bg-blue-400/10 rounded">Standard AI</span>
            </div>
          </motion.div>
        </div>

        <motion.button 
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.7 }}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={onStart}
          className="group relative w-full py-6 bg-white text-emerald-950 font-black text-xl rounded-[2rem] transition-all shadow-2xl shadow-white/10 flex items-center justify-center gap-3 overflow-hidden"
        >
          <div className="absolute inset-0 bg-emerald-400 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
          <span className="relative z-10">PLAY NOW</span>
          <Play size={24} className="relative z-10 fill-current" />
        </motion.button>

        <motion.p 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-center mt-8 text-[10px] text-emerald-300/20 uppercase tracking-[0.5em] font-mono"
        >
          v1.0.0 • Built with React & Motion
        </motion.p>
      </div>
    </motion.div>
  );
};

/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CardData, 
  Suit, 
  Rank, 
  GameStatus, 
  Turn, 
  SUITS, 
  RANKS, 
  SUIT_SYMBOLS, 
  SUIT_COLORS 
} from './types';
import { Card } from './components/Card';
import { SuitSelector } from './components/SuitSelector';
import { StartScreen } from './components/StartScreen';
import { Trophy, RotateCcw, Info, User, Cpu, Layers } from 'lucide-react';

// --- Utils ---
const createDeck = (): CardData[] => {
  const deck: CardData[] = [];
  SUITS.forEach(suit => {
    RANKS.forEach(rank => {
      deck.push({
        id: `${rank}-${suit}`,
        suit,
        rank,
      });
    });
  });
  return deck;
};

const shuffle = (deck: CardData[]): CardData[] => {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
};

export default function App() {
  console.log("Xcx Crazy Eights App Rendering");
  const [deck, setDeck] = useState<CardData[]>([]);
  const [playerHand, setPlayerHand] = useState<CardData[]>([]);
  const [aiHand, setAiHand] = useState<CardData[]>([]);
  const [discardPile, setDiscardPile] = useState<CardData[]>([]);
  const [gameStatus, setGameStatus] = useState<GameStatus>('waiting');
  const [turn, setTurn] = useState<Turn>('player');
  const [wildSuit, setWildSuit] = useState<Suit | null>(null);
  const [message, setMessage] = useState<string>("Welcome to Crazy Eights!");

  // --- Game Actions ---
  const initGame = () => {
    const fullDeck = shuffle(createDeck());
    const pHand = fullDeck.splice(0, 8);
    const aHand = fullDeck.splice(0, 8);
    
    // Find a non-8 card for the first discard
    let firstDiscardIndex = 0;
    while (fullDeck[firstDiscardIndex].rank === '8') {
      firstDiscardIndex++;
    }
    const firstDiscard = fullDeck.splice(firstDiscardIndex, 1)[0];

    setPlayerHand(pHand);
    setAiHand(aHand);
    setDiscardPile([firstDiscard]);
    setDeck(fullDeck);
    setGameStatus('playing');
    setTurn('player');
    setWildSuit(null);
    setMessage("Your turn! Match suit or rank.");
  };

  const topCard = discardPile[discardPile.length - 1];
  const currentSuit = wildSuit || topCard?.suit;

  const isPlayable = useCallback((card: CardData) => {
    if (!topCard) return false;
    if (card.rank === '8') return true;
    return card.suit === currentSuit || card.rank === topCard.rank;
  }, [topCard, currentSuit]);

  const playCard = (card: CardData, isPlayer: boolean) => {
    if (isPlayer) {
      setPlayerHand(prev => prev.filter(c => c.id !== card.id));
    } else {
      setAiHand(prev => prev.filter(c => c.id !== card.id));
    }

    setDiscardPile(prev => [...prev, card]);
    setWildSuit(null); // Reset wild suit unless it's an 8

    if (card.rank === '8') {
      if (isPlayer) {
        setGameStatus('choosing_suit');
      } else {
        // AI chooses a suit (most frequent suit in hand)
        const suitCounts: Record<Suit, number> = { hearts: 0, diamonds: 0, clubs: 0, spades: 0 };
        aiHand.forEach(c => suitCounts[c.suit]++);
        const bestSuit = (Object.keys(suitCounts) as Suit[]).reduce((a, b) => suitCounts[a] > suitCounts[b] ? a : b);
        setWildSuit(bestSuit);
        setMessage(`AI played an 8 and chose ${bestSuit}!`);
        setTurn('player');
      }
    } else {
      setTurn(isPlayer ? 'ai' : 'player');
      setMessage(isPlayer ? "AI's turn..." : "Your turn!");
    }
  };

  const drawCard = (isPlayer: boolean) => {
    if (deck.length === 0) {
      setMessage("Deck is empty! Skipping turn.");
      setTurn(isPlayer ? 'ai' : 'player');
      return;
    }

    const newCard = deck[0];
    setDeck(prev => prev.slice(1));

    if (isPlayer) {
      setPlayerHand(prev => [...prev, newCard]);
      // If the drawn card is playable, the player can play it immediately or end turn
      // For simplicity in this version, drawing ends turn if not playable, or stays player turn if playable?
      // Standard rule: draw one, if playable can play, otherwise turn ends.
      if (!isPlayable(newCard)) {
        setTurn('ai');
        setMessage("No playable cards drawn. AI's turn.");
      } else {
        setMessage("You drew a playable card!");
      }
    } else {
      setAiHand(prev => [...prev, newCard]);
      if (!isPlayable(newCard)) {
        setTurn('player');
        setMessage("AI drew but couldn't play. Your turn!");
      } else {
        // AI will play it in the next AI effect cycle
      }
    }
  };

  const handleSuitSelect = (suit: Suit) => {
    setWildSuit(suit);
    setGameStatus('playing');
    setTurn('ai');
    setMessage(`You chose ${suit}. AI's turn...`);
  };

  // --- AI Logic ---
  useEffect(() => {
    if (turn === 'ai' && gameStatus === 'playing') {
      const timer = setTimeout(() => {
        const playableCards = aiHand.filter(isPlayable);
        
        if (playableCards.length > 0) {
          // AI Strategy: Play non-8s first
          const normalCards = playableCards.filter(c => c.rank !== '8');
          const cardToPlay = normalCards.length > 0 
            ? normalCards[Math.floor(Math.random() * normalCards.length)]
            : playableCards[0];
          
          playCard(cardToPlay, false);
        } else {
          drawCard(false);
        }
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [turn, aiHand, isPlayable, gameStatus]);

  // --- Win Condition ---
  useEffect(() => {
    if (gameStatus === 'playing') {
      if (playerHand.length === 0) {
        setGameStatus('game_over');
        setMessage("Congratulations! You won!");
      } else if (aiHand.length === 0) {
        setGameStatus('game_over');
        setMessage("AI won! Better luck next time.");
      }
    }
  }, [playerHand.length, aiHand.length, gameStatus]);

  // --- Render Helpers ---
  const playerPlayableCards = useMemo(() => 
    playerHand.filter(isPlayable), 
  [playerHand, isPlayable]);

  return (
    <div className="min-h-screen felt-texture flex flex-col p-2 sm:p-4 font-sans">
      {/* Header */}
      <header className="flex justify-between items-center mb-4 sm:mb-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-white/10 rounded-lg flex items-center justify-center border border-white/20">
            <span className="text-lg sm:text-xl">8</span>
          </div>
          <div>
            <h1 className="text-sm sm:text-lg font-serif italic font-bold tracking-tight text-white">Xcx Crazy Eights</h1>
            <p className="text-[8px] sm:text-[10px] text-emerald-300/60 uppercase tracking-widest font-bold">Modern Edition</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button 
            onClick={initGame}
            className="flex items-center gap-1 px-3 py-1 bg-white/5 hover:bg-white/10 rounded-full border border-white/10 transition-colors text-[10px] sm:text-xs font-medium text-white"
          >
            <RotateCcw size={12} />
            Reset
          </button>
        </div>
      </header>

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col justify-between max-w-6xl mx-auto w-full gap-6 sm:gap-8">
        
        {/* AI Hand */}
        <div className="flex flex-col items-center gap-2">
          <div className="flex items-center gap-2 px-2 py-0.5 bg-black/20 rounded-full border border-white/5">
            <Cpu size={12} className="text-blue-400" />
            <span className="text-[10px] font-mono uppercase tracking-tighter text-zinc-400">AI Opponent</span>
            <span className="ml-1 px-1 py-0.5 bg-blue-500/20 text-blue-400 rounded text-[8px] font-bold">
              {aiHand.length}
            </span>
          </div>
          <div className="flex -space-x-14 sm:-space-x-16 justify-center min-h-[100px] sm:min-h-[144px]">
            {aiHand.map((card, i) => (
              <Card key={card.id} card={card} isFaceUp={false} index={i} className="scale-75 sm:scale-90 opacity-80" />
            ))}
          </div>
        </div>

        {/* Center: Deck & Discard */}
        <div className="flex flex-col items-center justify-center gap-4 sm:gap-6 my-4">
          <div className="flex items-center gap-8 sm:gap-16">
            {/* Draw Pile */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative group">
                {deck.length > 0 ? (
                  <Card 
                    card={deck[0]} 
                    isFaceUp={false} 
                    isPlayable={turn === 'player' && playerPlayableCards.length === 0 && gameStatus === 'playing'}
                    onClick={() => drawCard(true)}
                    className="scale-90 sm:scale-100"
                  />
                ) : (
                  <div className="w-16 h-24 sm:w-24 sm:h-36 rounded-lg border-2 border-dashed border-white/20 flex items-center justify-center text-white/20 text-xs">
                    Empty
                  </div>
                )}
                {deck.length > 1 && (
                  <div className="absolute -bottom-1 -right-1 w-full h-full bg-blue-900 rounded-lg -z-10 card-shadow scale-90 sm:scale-100" />
                )}
              </div>
              <span className="text-[8px] sm:text-[10px] font-mono text-emerald-300/40 uppercase tracking-widest">Draw ({deck.length})</span>
            </div>

            {/* Discard Pile */}
            <div className="flex flex-col items-center gap-2">
              <div className="relative">
                <AnimatePresence mode="popLayout">
                  {topCard && (
                    <Card 
                      key={topCard.id} 
                      card={topCard} 
                      className="z-10 scale-90 sm:scale-100"
                    />
                  )}
                </AnimatePresence>
                {discardPile.length > 1 && (
                  <div className="absolute -bottom-1 -right-1 w-full h-full bg-white/20 rounded-lg -z-10 scale-90 sm:scale-100" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[8px] sm:text-[10px] font-mono text-emerald-300/40 uppercase tracking-widest">Discard</span>
                {wildSuit && (
                  <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded bg-white/10 border border-white/10 ${SUIT_COLORS[wildSuit]}`}>
                    <span className="text-[10px] sm:text-xs">{SUIT_SYMBOLS[wildSuit]}</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Status Message */}
          <motion.div 
            key={message}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="px-6 py-2 bg-black/40 backdrop-blur-md rounded-full border border-white/10 text-xs sm:text-sm font-medium text-center shadow-lg text-white"
          >
            {message}
          </motion.div>
        </div>

        {/* Player Hand */}
        <div className="flex flex-col items-center gap-4 mt-auto pt-4 pb-8">
          <div className="flex items-center gap-2 px-3 py-1 bg-black/20 rounded-full border border-white/5">
            <User size={12} className="text-emerald-400" />
            <span className="text-[10px] sm:text-xs font-mono uppercase tracking-tighter text-zinc-400">Your Hand</span>
            <span className="ml-1 px-2 py-0.5 bg-emerald-500/20 text-emerald-400 rounded text-[10px] font-bold">
              {playerHand.length}
            </span>
          </div>
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 max-w-5xl p-2">
            {playerHand.map((card, i) => (
              <Card 
                key={card.id} 
                card={card} 
                isPlayable={turn === 'player' && gameStatus === 'playing' && isPlayable(card)}
                onClick={() => playCard(card, true)}
                index={i}
                className="scale-90 sm:scale-100"
              />
            ))}
          </div>
        </div>

      </main>

      {/* Overlays */}
      <AnimatePresence>
        {gameStatus === 'waiting' && (
          <StartScreen onStart={initGame} />
        )}

        {gameStatus === 'choosing_suit' && (
          <SuitSelector onSelect={handleSuitSelect} />
        )}

        {gameStatus === 'game_over' && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
          >
            <div className="bg-zinc-900 p-10 rounded-[2rem] border border-white/10 shadow-2xl max-w-lg w-full text-center">
              <div className="w-20 h-20 bg-yellow-500/20 rounded-3xl flex items-center justify-center mx-auto mb-6 border border-yellow-500/30">
                <Trophy size={40} className="text-yellow-400" />
              </div>
              <h2 className="text-4xl font-serif italic text-white mb-4">Game Over</h2>
              <p className="text-2xl text-zinc-300 mb-8">{message}</p>
              <button 
                onClick={initGame}
                className="w-full py-4 bg-white text-zinc-900 font-bold rounded-2xl transition-all transform hover:scale-[1.02] active:scale-[0.98]"
              >
                Play Again
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer Info */}
      <footer className="mt-8 flex justify-center">
        <div className="flex items-center gap-6 text-[10px] font-mono uppercase tracking-widest text-emerald-300/30">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>Standard 52 Deck</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-blue-500" />
            <span>AI Enabled</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-yellow-500" />
            <span>Wild 8s</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpellDuel } from '@/hooks/useSpellDuel';
import { useAuth } from '@/components/Auth/AuthContext';
import { supabase } from '@/lib/supabase';
import { Zap, Skull, Play, Home, Trophy, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { HarryMascot, House } from '@/components/games/HarryMascot';
import { VoldemortMascot } from '@/components/games/VoldemortMascot';

export default function SpellDuelPage() {
  const { 
    gamePhase, currentSpell, input, harryHP, voldemortHP, 
    beamPosition, roundTimer, score, roundResult, startGame, stats 
  } = useSpellDuel();
  
  const { user } = useAuth();
  const [sessionSaved, setSessionSaved] = useState(false);
  const [house] = useState<House>(() => ['gryffindor', 'slytherin', 'hufflepuff', 'ravenclaw'][Math.floor(Math.random() * 4)] as House);

  // Focus input hidden element on mobile (optional, but handling keyboard event directly is easier)
  
  useEffect(() => {
    if ((gamePhase === 'victory' || gamePhase === 'defeat') && user && !sessionSaved) {
      setSessionSaved(true);
      const saveScore = async () => {
        try {
          const acc = stats.totalCharsTyped > 0 
            ? Math.max(0, (stats.totalCharsTyped - stats.errors) / stats.totalCharsTyped) 
            : 0;
            
          await supabase.from('typing_sessions').insert({
            user_id: user.id,
            interest: 'spell_duel',
            difficulty: 'escalating',
            wpm: Math.round(score), // Storing score in WPM column for games
            accuracy: Math.round(acc * 100),
            duration_seconds: 0,
            error_count: stats.errors
          });
        } catch (e) {
          console.error("Error saving game score", e);
        }
      };
      saveScore();
    }
  }, [gamePhase, user, sessionSaved, score, stats]);

  const handleStart = () => {
    setSessionSaved(false);
    startGame();
  };

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-4 w-full relative bg-gradient-to-b from-[#0a0515] to-[#040e10] overflow-hidden">
      
      {/* HUD */}
      {gamePhase !== 'idle' && (
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
          <div className="flex flex-col gap-2">
            <div className="text-xl font-bold text-white uppercase tracking-widest text-shadow-md">Harry</div>
            <div className="flex gap-1">
              {[...Array(3)].map((_, i) => (
                <Zap key={i} className={`w-8 h-8 ${i < harryHP ? 'text-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.8)] fill-yellow-400' : 'text-gray-700'}`} />
              ))}
            </div>
            <div className="text-sm text-yellow-400 font-bold tracking-widest mt-2">SCORE: {score}</div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="text-xl font-bold text-red-500 uppercase tracking-widest text-shadow-md">Voldemort</div>
            <div className="flex gap-1">
              {[...Array(5)].map((_, i) => (
                <div key={i} className={`w-6 h-6 rounded-full border-2 border-red-900 ${i < voldemortHP ? 'bg-red-600 shadow-[0_0_10px_rgba(220,38,38,0.8)]' : 'bg-transparent'}`} />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Game Area */}
      <AnimatePresence mode="wait">
        {gamePhase === 'idle' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="text-center z-20 bg-black/60 p-12 rounded-3xl border border-[#331b4d] backdrop-blur-md"
          >
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-yellow-300 to-amber-600 drop-shadow-lg tracking-tight mb-4 uppercase">
              Spell Duel
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Type the spells correctly and quickly to push the magic beam toward Voldemort. Any errors or slowness will give him the upper hand.
            </p>
            <button 
              onClick={handleStart}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white px-10 py-5 rounded-full font-black text-xl uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_30px_rgba(147,51,234,0.5)] cursor-pointer"
            >
              Start Duel
            </button>
          </motion.div>
        )}

        {(gamePhase === 'dueling' || gamePhase === 'roundEnd') && (
          <motion.div 
            key="dueling"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full max-w-5xl h-[60vh] flex flex-col justify-center items-center relative"
          >
            {/* Characters */}
            <div className="absolute left-0 top-1/2 -translate-y-1/2 text-center opacity-80 z-0">
              <div className="w-24 h-48 bg-blue-900/40 rounded-full blur-xl absolute -inset-4"></div>
              <div className="text-white font-black text-2xl tracking-widest rotate-90 origin-left translate-x-12 opacity-30">POTTER</div>
            </div>
            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-center opacity-80 z-0">
              <div className="w-24 h-48 bg-green-900/40 rounded-full blur-xl absolute -inset-4"></div>
              <div className="text-white font-black text-2xl tracking-widest -rotate-90 origin-right -translate-x-12 opacity-30">RIDDLE</div>
            </div>

            {/* Spell Text */}
            <div className="absolute top-10 w-full flex flex-col items-center z-20">
              <div className="w-64 h-2 bg-gray-800 rounded-full overflow-hidden mb-6 shadow-inner">
                <div 
                  className="h-full bg-gradient-to-r from-red-500 to-yellow-500 transition-all duration-100 ease-linear"
                  style={{ width: `${roundTimer}%` }}
                />
              </div>
              <div className="text-5xl md:text-7xl font-mono tracking-widest uppercase font-black text-gray-700 drop-shadow-xl flex">
                {currentSpell.split('').map((char, i) => {
                  let colorClass = "text-gray-600";
                  let glowClass = "";
                  if (i < input.length) {
                    colorClass = "text-yellow-300";
                    glowClass = "drop-shadow-[0_0_15px_rgba(253,224,71,0.8)]";
                  }
                  return (
                    <span key={i} className={`${colorClass} ${glowClass} transition-colors duration-75`}>
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  );
                })}
              </div>
            </div>

            {/* The Magic Beam */}
            <div className="w-full h-12 relative flex items-center z-10 mt-32">
              <div className="absolute left-10 right-10 h-1 bg-gray-800 rounded-full"></div>
              <motion.div 
                className="absolute h-8 flex items-center justify-center -ml-4"
                style={{ left: `clamp(10%, ${beamPosition}%, 90%)` }}
                layout
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
              >
                {/* Clash Effect */}
                <div className="w-16 h-16 rounded-full bg-white blur-md absolute"></div>
                <div className="w-32 h-32 rounded-full bg-yellow-400 blur-2xl absolute opacity-60"></div>
                <div className="w-8 h-8 rounded-full bg-white z-10 relative shadow-[0_0_20px_#fff]"></div>
                
                {/* Harry's Beam */}
                <div className="absolute right-4 w-[100vw] h-2 bg-blue-400 blur-[2px] shadow-[0_0_15px_rgba(96,165,250,1)] origin-right rounded-l-full"></div>
                <div className="absolute right-4 w-[100vw] h-1 bg-white z-10 origin-right rounded-l-full"></div>
                
                {/* Voldemort's Beam */}
                <div className="absolute left-4 w-[100vw] h-2 bg-green-500 blur-[2px] shadow-[0_0_15px_rgba(34,197,94,1)] origin-left rounded-r-full"></div>
                <div className="absolute left-4 w-[100vw] h-1 bg-white z-10 origin-left rounded-r-full"></div>
              </motion.div>
            </div>

            {/* Round Feedback */}
            <AnimatePresence>
              {gamePhase === 'roundEnd' && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.5, y: -50 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.5 }}
                  className="absolute bottom-20 text-4xl font-black uppercase tracking-widest z-30"
                >
                  {roundResult === 'win' ? (
                    <span className="text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.8)]">Voldemort Weakens!</span>
                  ) : (
                    <span className="text-red-500 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]">Harry takes a hit!</span>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {/* Victory/Defeat Modal */}
        {(gamePhase === 'victory' || gamePhase === 'defeat') && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-sm z-50 flex flex-col items-center justify-center p-4 text-center overflow-y-auto"
          >
            <div className={`flex flex-col md:flex-row items-center justify-center p-8 rounded-3xl my-8 shadow-2xl relative w-full max-w-2xl border-4 ${gamePhase === 'victory' ? 'border-[#7F0909]' : 'border-[#111]'}`}
                 style={{ background: gamePhase === 'victory' ? 'linear-gradient(135deg, #f4e4bc, #e8d5a3)' : 'linear-gradient(135deg, #1a1a2e, #16213e)' }}>
              
              <div className="md:w-1/3 flex justify-center mb-6 md:mb-0">
                {gamePhase === 'victory' ? <HarryMascot house={house} className="w-40 h-40 drop-shadow-xl" /> : <VoldemortMascot className="w-40 h-40 drop-shadow-xl" />}
              </div>
              
              <div className={`md:w-2/3 flex flex-col items-center md:items-start text-left px-6 ${gamePhase === 'victory' ? 'text-[#3e2723]' : 'text-gray-300'}`}>
                <h2 className={`text-3xl md:text-5xl font-black uppercase tracking-widest mb-2 ${gamePhase === 'victory' ? 'text-[#3e2723]' : 'text-red-500'}`}>
                  {gamePhase === 'victory' ? 'The Boy Who Lived' : 'The Dark Lord Wins'}
                </h2>
                <p className={`text-lg mb-6 ${gamePhase === 'victory' ? 'text-[#5d4037]' : 'text-gray-400'}`}>
                  {gamePhase === 'victory' 
                    ? `You successfully repelled Voldemort's attacks and won the duel for House ${house.charAt(0).toUpperCase() + house.slice(1)}!` 
                    : "Your typing wasn't fast enough to hold back the dark magic."}
                </p>
                
                <div className={`p-4 rounded-xl w-full mb-6 ${gamePhase === 'victory' ? 'bg-[#d7ccc8]/50 border border-[#bcaaa4]' : 'bg-[#0f3460]/50 border border-[#e94560]'}`}>
                  <div className="text-sm font-bold uppercase tracking-widest mb-1 opacity-70">Final Score</div>
                  <div className={`text-4xl font-black mb-2 ${gamePhase === 'victory' ? 'text-[#3e2723]' : 'text-white'}`}>{score}</div>
                  <div className="flex justify-between border-t border-black/10 pt-2 mt-2">
                    <div className="text-center w-1/2 border-r border-black/10">
                      <div className="text-xl font-bold">{stats.totalCharsTyped}</div>
                      <div className="text-[10px] uppercase tracking-widest opacity-70">Keystrokes</div>
                    </div>
                    <div className="text-center w-1/2">
                      <div className="text-xl font-bold">{stats.errors}</div>
                      <div className="text-[10px] uppercase tracking-widest opacity-70">Errors</div>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full">
                  <button 
                    onClick={() => {
                      const shareText = `I scored ${Math.round(score)} WPM in the Harry Potter Spell Duel on TypeVerse! ⚡ House ${house.charAt(0).toUpperCase() + house.slice(1)} represent! Can you beat me? https://type-verse-rho.vercel.app/games/harry-potter`;
                      window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                    }}
                    className="flex-1 bg-[#25D366] hover:bg-[#1ebe57] text-white px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors shadow-lg shadow-[#25D366]/20 whitespace-nowrap"
                  >
                    WhatsApp
                  </button>
                  <button 
                    onClick={handleStart}
                    className={`flex-1 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg ${gamePhase === 'victory' ? 'bg-[#3e2723] hover:bg-[#2c1c19] text-white' : 'bg-red-600 hover:bg-red-700 text-white shadow-red-600/20'}`}
                  >
                    <RefreshCw className="w-4 h-4" /> Again
                  </button>
                  <Link 
                    href="/games"
                    className={`flex-1 px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer ${gamePhase === 'victory' ? 'bg-[#bcaaa4] hover:bg-[#a1887f] text-[#3e2723]' : 'bg-[#1a1a2e] hover:bg-[#16213e] text-white border border-gray-700'}`}
                  >
                    <Home className="w-4 h-4" /> Lobby
                  </Link>
                </div>
                
                {user && (
                  <p className={`text-sm font-bold tracking-widest uppercase mt-4 opacity-80 ${gamePhase === 'victory' ? 'text-green-800' : 'text-red-400'}`}>
                    Score saved to your profile
                  </p>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

'use client';
import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { usePotionMaster } from '@/hooks/usePotionMaster';
import { useAuth } from '@/components/Auth/AuthContext';
import { supabase } from '@/lib/supabase';
import { Home, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { SnapeMascot } from '@/components/games/SnapeMascot';

export default function PotionMasterPage() {
  const { 
    gamePhase, cauldrons, hp, anger, score, potionsBottled, detentionFlash, 
    startGame, stats 
  } = usePotionMaster();
  
  const { user } = useAuth();
  const [sessionSaved, setSessionSaved] = useState(false);

  useEffect(() => {
    if (gamePhase === 'gameover' && user && !sessionSaved) {
      setSessionSaved(true);
      const saveScore = async () => {
        try {
          const acc = stats.totalCharsTyped > 0 
            ? Math.max(0, (stats.totalCharsTyped - stats.errors) / stats.totalCharsTyped) 
            : 0;
            
          await supabase.from('typing_sessions').insert({
            user_id: user.id,
            interest: 'potion_master',
            difficulty: 'escalating',
            wpm: Math.round(score), // Storing score in WPM column for games
            accuracy: Math.round(acc * 100),
            duration_seconds: Math.round((performance.now() - stats.startTime) / 1000),
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

  const shareText = `I bottled ${potionsBottled} potions and scored ${Math.round(score)} in Potion Master on TypeVerse! 🧪 Can you beat me without angering Snape? https://type-verse-rho.vercel.app/games/potion-master`;

  return (
    <div className="flex-1 flex flex-col p-4 w-full relative bg-[#050b14] overflow-hidden" 
         style={{ backgroundImage: 'radial-gradient(circle at center, #0a1128 0%, #010308 100%)' }}>
      
      {/* Dynamic CSS styles for game elements */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes bubbleRise {
          0% { transform: translateY(0) scale(0.5); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-40px) scale(1.5); opacity: 0; }
        }
        @keyframes explosionSmoke {
          0% { transform: scale(0.5); opacity: 0.8; filter: brightness(2); }
          100% { transform: scale(3); opacity: 0; filter: brightness(0.5); }
        }
        .bubble { animation: bubbleRise 2s infinite ease-in; position: absolute; border-radius: 50%; }
        .smoke { animation: explosionSmoke 0.8s forwards ease-out; position: absolute; border-radius: 50%; background: #555; }
        .dungeon-wall {
          background-image: 
            linear-gradient(335deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 20%),
            linear-gradient(155deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 20%),
            linear-gradient(335deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 20%),
            linear-gradient(155deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0) 20%);
          background-size: 80px 80px;
          background-position: 0px 0px, 10px 14px, 40px 40px, 50px 54px;
        }
      `}} />

      {/* Background Texture */}
      <div className="absolute inset-0 dungeon-wall opacity-30 pointer-events-none"></div>

      {/* DETENTION Flash */}
      <AnimatePresence>
        {detentionFlash && (
          <motion.div 
            initial={{ opacity: 0.8 }}
            animate={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="absolute inset-0 bg-red-600 z-40 pointer-events-none flex items-center justify-center"
          >
            <span className="text-8xl font-black text-white uppercase tracking-widest drop-shadow-2xl">DETENTION!</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD */}
      {gamePhase !== 'idle' && (
        <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="text-3xl drop-shadow-md">
                  {i < hp ? '🧪' : <span className="opacity-30 grayscale">🧪</span>}
                </div>
              ))}
            </div>
            <div className="text-sm text-[var(--color-accent)] font-bold tracking-widest mt-2 uppercase">Score: {score}</div>
          </div>
          
          <div className="flex flex-col items-end gap-2 relative">
            {/* Shelf Counter */}
            <div className="bg-[#1a1a2e] border border-[#2a2a4a] px-4 py-2 rounded-lg flex items-center gap-3 shadow-xl">
              <span className="text-white font-bold">Bottled: {potionsBottled}</span>
            </div>
          </div>
        </div>
      )}

      {/* Snape Anger Meter (Right Side) */}
      {gamePhase === 'playing' && (
        <div className="absolute right-8 top-1/2 -translate-y-1/2 flex flex-col items-center gap-4 z-10">
          <SnapeMascot className="w-24 h-24 drop-shadow-[0_0_15px_rgba(0,0,0,0.8)]" />
          <div className="h-64 w-6 bg-black border-2 border-gray-800 rounded-full overflow-hidden flex flex-col justify-end shadow-inner relative">
            <div 
              className="w-full bg-gradient-to-t from-red-800 to-red-500 transition-all duration-300 ease-out relative"
              style={{ height: `${anger}%` }}
            >
              {anger > 80 && (
                <div className="absolute inset-0 bg-red-400 animate-pulse mix-blend-overlay"></div>
              )}
            </div>
          </div>
          <div className="text-xs font-bold text-red-500 uppercase tracking-widest bg-black/50 px-2 py-1 rounded">Anger</div>
        </div>
      )}

      {/* Main Game Area */}
      <AnimatePresence mode="wait">
        {gamePhase === 'idle' && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="m-auto text-center z-20 bg-black/70 p-12 rounded-3xl border border-[#2a2a4a] backdrop-blur-md shadow-2xl"
          >
            <h1 className="text-5xl md:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-b from-green-300 to-emerald-700 drop-shadow-lg tracking-tight mb-4 uppercase">
              Potion Master
            </h1>
            <p className="text-gray-300 text-lg mb-8 max-w-md mx-auto leading-relaxed">
              Brew potions before they explode. Type the required ingredients quickly. Mistakes will anger Professor Snape.
            </p>
            <button 
              onClick={handleStart}
              className="bg-gradient-to-r from-emerald-600 to-green-800 hover:from-emerald-500 hover:to-green-700 text-white px-10 py-5 rounded-full font-black text-xl uppercase tracking-widest transition-all hover:scale-105 shadow-[0_0_30px_rgba(16,185,129,0.4)] cursor-pointer"
            >
              Start Class
            </button>
          </motion.div>
        )}

        {gamePhase === 'playing' && (
          <motion.div 
            key="playing"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="w-full h-full flex flex-col justify-end items-center pb-12 relative"
          >
            {/* Cauldrons Container */}
            <div className="flex justify-center items-end gap-4 md:gap-12 w-full max-w-4xl min-h-[300px]">
              <AnimatePresence>
                {cauldrons.map((cauldron) => (
                  <motion.div
                    key={cauldron.id}
                    initial={{ opacity: 0, y: 50, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.5 }}
                    transition={{ type: 'spring', bounce: 0.4 }}
                    className="flex flex-col items-center relative"
                  >
                    {/* Word Display */}
                    {!cauldron.isExploding && !cauldron.isSuccess && (
                      <div className="absolute -top-20 flex flex-col items-center whitespace-nowrap bg-black/60 px-4 py-2 rounded-xl backdrop-blur-sm border border-gray-800 shadow-xl">
                        <div className="text-xs font-bold text-gray-400 mb-1 uppercase tracking-wider">{cauldron.potionName}</div>
                        <div className="text-2xl md:text-3xl font-mono font-black flex drop-shadow-md">
                          {cauldron.word.split('').map((char, i) => {
                            let color = "text-gray-500";
                            if (i < cauldron.typedSoFar.length) {
                              color = cauldron.isTargeted ? "text-yellow-400" : "text-white";
                            }
                            return (
                              <span key={i} className={`${color} ${i < cauldron.typedSoFar.length ? 'drop-shadow-[0_0_8px_rgba(250,204,21,0.8)]' : ''}`}>
                                {char}
                              </span>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Timer Bar */}
                    {!cauldron.isExploding && !cauldron.isSuccess && (
                      <div className="w-24 h-2 bg-gray-900 rounded-full overflow-hidden absolute -top-4 shadow-inner">
                        <div 
                          className="h-full transition-all duration-100 linear"
                          style={{ 
                            width: `${(cauldron.timeLeft / cauldron.maxTime) * 100}%`,
                            backgroundColor: cauldron.timeLeft < (cauldron.maxTime * 0.3) ? '#ef4444' : cauldron.potionColor 
                          }}
                        />
                      </div>
                    )}

                    {/* The Cauldron Graphic */}
                    <div className="relative mt-8">
                      {/* Exploding animation */}
                      {cauldron.isExploding && (
                        <div className="absolute inset-0 flex items-center justify-center z-20">
                          <div className="smoke w-16 h-16 bg-gray-500"></div>
                          <div className="smoke w-20 h-20 bg-gray-700" style={{ animationDelay: '0.1s' }}></div>
                          <div className="smoke w-12 h-12 bg-red-900" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                      )}
                      
                      {/* Success animation */}
                      {cauldron.isSuccess && (
                        <motion.div 
                          initial={{ y: 0, opacity: 1, scale: 1 }}
                          animate={{ y: -200, opacity: 0, scale: 0.5 }}
                          transition={{ duration: 1 }}
                          className="absolute inset-0 flex items-center justify-center z-20"
                        >
                          <div className="w-8 h-12 rounded-t-lg rounded-b-xl border-2 border-white/50 backdrop-blur-md flex flex-col justify-end overflow-hidden"
                               style={{ backgroundColor: 'rgba(255,255,255,0.2)', boxShadow: `0 0 20px ${cauldron.potionColor}` }}>
                            <div className="w-full h-3/4" style={{ backgroundColor: cauldron.potionColor }}></div>
                          </div>
                        </motion.div>
                      )}

                      {/* Main Cauldron Shape using CSS */}
                      <div className="relative flex flex-col items-center w-24 h-24 sm:w-32 sm:h-32">
                        {/* Cauldron Rim */}
                        <div className="w-full h-4 sm:h-6 bg-[#1a1a1a] rounded-[50%] border-2 border-[#333] z-10 relative overflow-hidden flex items-center justify-center shadow-inner">
                          {/* Inner potion liquid */}
                          <div 
                            className="w-full h-full rounded-[50%] opacity-80" 
                            style={{ backgroundColor: cauldron.potionColor, boxShadow: `inset 0 0 10px rgba(0,0,0,0.8), 0 0 20px ${cauldron.potionColor}` }}
                          ></div>
                        </div>
                        {/* Cauldron Body */}
                        <div className="w-[90%] h-full bg-[#111] rounded-b-[40%] rounded-t-[10%] -mt-2 sm:-mt-3 shadow-[inset_-10px_-10px_20px_rgba(0,0,0,0.8),_10px_10px_20px_rgba(0,0,0,0.5)] flex justify-center">
                          {/* Bubbles generated purely in CSS */}
                          {!cauldron.isExploding && !cauldron.isSuccess && (
                            <>
                              <div className="bubble w-2 h-2 left-[30%] bottom-4" style={{ backgroundColor: cauldron.potionColor, animationDuration: '1.5s', animationDelay: '0.1s' }}></div>
                              <div className="bubble w-3 h-3 left-[50%] bottom-2" style={{ backgroundColor: cauldron.potionColor, animationDuration: '2s', animationDelay: '0.4s' }}></div>
                              <div className="bubble w-2 h-2 left-[70%] bottom-6" style={{ backgroundColor: cauldron.potionColor, animationDuration: '1.2s', animationDelay: '0.8s' }}></div>
                            </>
                          )}
                        </div>
                        {/* Target Glow */}
                        {cauldron.isTargeted && !cauldron.isExploding && !cauldron.isSuccess && (
                          <div className="absolute inset-0 bg-yellow-400 opacity-20 rounded-full blur-xl pointer-events-none mix-blend-screen"></div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {/* Game Over Modal */}
        {gamePhase === 'gameover' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center p-4 text-center overflow-y-auto"
          >
            <div className="flex flex-col md:flex-row items-center justify-center p-8 rounded-3xl my-8 shadow-2xl relative w-full max-w-2xl bg-gradient-to-br from-[#1a1a2e] to-[#0d0d1a] border-4 border-gray-800">
              
              <div className="md:w-1/3 flex flex-col items-center justify-center mb-6 md:mb-0">
                <SnapeMascot className="w-48 h-48 drop-shadow-[0_0_20px_rgba(0,0,0,0.8)]" />
              </div>
              
              <div className="md:w-2/3 flex flex-col items-center md:items-start text-left px-6 text-gray-300">
                <h2 className="text-3xl md:text-5xl font-black uppercase tracking-widest mb-2 text-white drop-shadow-md">
                  Class Dismissed
                </h2>
                <div className="bg-black/40 border border-gray-800 p-4 rounded-xl mb-6 relative italic text-gray-400 text-lg w-full">
                  <div className="absolute -top-3 -left-2 text-4xl text-gray-600 font-serif">"</div>
                  Pathetic. Even a first-year could do better. Ten points from your house.
                </div>
                
                <div className="grid grid-cols-2 gap-4 w-full mb-6">
                  <div className="bg-[#0f3460]/40 border border-[#16213e] p-4 rounded-xl text-center">
                    <div className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">Potions Bottled</div>
                    <div className="text-3xl font-black text-emerald-400">{potionsBottled}</div>
                  </div>
                  <div className="bg-[#0f3460]/40 border border-[#16213e] p-4 rounded-xl text-center">
                    <div className="text-xs font-bold uppercase tracking-widest mb-1 opacity-70">Final Score</div>
                    <div className="text-3xl font-black text-yellow-400">{score}</div>
                  </div>
                </div>

                <div className="flex flex-wrap gap-3 w-full">
                  <button 
                    onClick={() => window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank')}
                    className="flex-1 bg-[#25D366] hover:bg-[#1ebe57] text-white px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors shadow-lg shadow-[#25D366]/20 whitespace-nowrap"
                  >
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}`, '_blank')}
                    className="flex-1 bg-[#1DA1F2] hover:bg-[#1a91da] text-white px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors shadow-lg shadow-[#1DA1F2]/20 whitespace-nowrap"
                  >
                    Tweet
                  </button>
                  <button 
                    onClick={handleStart}
                    className="flex-1 bg-gray-700 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-lg"
                  >
                    <RefreshCw className="w-4 h-4" /> Again
                  </button>
                  <Link 
                    href="/games"
                    className="flex-1 bg-black hover:bg-gray-900 border border-gray-700 text-white px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Home className="w-4 h-4" /> Lobby
                  </Link>
                </div>
                
                {user && (
                  <p className="text-sm font-bold tracking-widest uppercase mt-4 opacity-80 text-gray-500">
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

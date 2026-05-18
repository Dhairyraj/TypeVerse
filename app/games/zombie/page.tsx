'use client';
import { useState, useEffect, useRef } from 'react';
import { useZombieGame } from '@/hooks/useZombieGame';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '@/components/Auth/AuthContext';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { ArrowLeft, RefreshCw, Skull, Keyboard as KeyboardIcon } from 'lucide-react';

export default function ZombieGamePage() {
  const [interest, setInterest] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const { user } = useAuth();
  const { zombies, lives, score, gameOver, input, difficultyTime, wordsDefeated, reset, wpm, accuracy } = useZombieGame(hasStarted ? interest : '');

  const [sessionSaved, setSessionSaved] = useState(false);
  
  // A hidden input for mobile keyboard triggering
  const mobileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (gameOver && user && !sessionSaved) {
      setSessionSaved(true);
      
      supabase.from('typing_sessions').insert({
        user_id: user.id,
        interest: 'zombie_game',
        difficulty: 'escalating',
        wpm,
        accuracy,
        duration_seconds: difficultyTime,
        error_count: 0
      }).then();

      supabase.from('user_stats').select('*').eq('user_id', user.id).single().then(({ data: stats }) => {
        const newTotalSessions = (stats?.total_sessions || 0) + 1;
        const newBestWpm = Math.max(stats?.best_wpm || 0, wpm);
        const newTotalTime = (stats?.total_time_minutes || 0) + (difficultyTime / 60);
        const newAverageWpm = ((stats?.average_wpm || 0) * (stats?.total_sessions || 0) + wpm) / newTotalSessions;

        supabase.from('user_stats').upsert({
          user_id: user.id,
          best_wpm: newBestWpm,
          average_wpm: newAverageWpm,
          total_sessions: newTotalSessions,
          total_time_minutes: newTotalTime,
          last_practiced: new Date().toISOString().split('T')[0]
        }).then();
      });
    }
  }, [gameOver, user, sessionSaved, wpm, accuracy, difficultyTime]);

  const handleStart = (selected: string) => {
    setInterest(selected);
    setHasStarted(true);
    setSessionSaved(false);
    reset();
    
    // Auto focus for mobile if possible
    setTimeout(() => {
      mobileInputRef.current?.focus();
    }, 100);
  };

  const handleRestart = () => {
    setSessionSaved(false);
    reset();
    setTimeout(() => {
      mobileInputRef.current?.focus();
    }, 100);
  };

  // Prevent default input behavior to stop double typing on mobile, the hook handles raw keydown
  const handleMobileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Just clear it so it stays empty, the global keydown captures the key
    e.target.value = '';
  };

  return (
    <div className="flex-1 flex flex-col items-center bg-[#050508] relative overflow-hidden text-white h-[calc(100vh-64px)] w-full">
      {/* Top bar */}
      <div className="w-full p-6 flex justify-between items-center z-10 bg-gradient-to-b from-black/90 to-transparent">
        <Link href="/games" className="text-gray-400 hover:text-white flex items-center gap-2 font-medium transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back
        </Link>
        <div className="flex gap-4 md:gap-8 font-bold font-mono text-lg md:text-xl">
          <div className="flex items-center gap-2 text-red-500"><Skull className="w-5 h-5"/> {lives}</div>
          <div className="flex items-center gap-2 text-yellow-400">Score: {score}</div>
          <div className="flex items-center gap-2 text-blue-400 hidden sm:flex">{Math.floor(difficultyTime / 60)}:{(difficultyTime % 60).toString().padStart(2, '0')}</div>
        </div>
        <div className="w-16 md:w-20"></div>
      </div>

      {/* Game Area */}
      {hasStarted && !gameOver && (
        <>
          {difficultyTime > 30 && (
            <div className="absolute inset-0 pointer-events-none opacity-10 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPgo8bGluZSB4MT0iNTAiIHkxPSIwIiB4Mj0iNTAiIHkyPSIxMDAlIiBzdHJva2U9IiNmZmYiIHN0cm9rZS13aWR0aD0iMSIgc3Ryb2tlLWRhc2hhcnJheT0iNCwgNCIgLz4KPC9zdmc+')] bg-repeat-y" style={{ backgroundSize: '100% 1000px', animation: 'slide 1s linear infinite' }} />
          )}

          <div className="flex-1 w-full max-w-4xl relative">
            {zombies.map(z => (
              <div 
                key={z.id}
                className="absolute flex flex-col items-center justify-center transform -translate-x-1/2"
                style={{ left: `${z.x}%`, top: `${z.y}%` }}
              >
                <div className={`text-4xl mb-2 ${z.isTargeted ? 'text-[var(--color-accent)] scale-125' : 'text-green-500'} transition-transform drop-shadow-[0_0_12px_currentColor]`}>
                  🧟
                </div>
                <div className={`px-4 py-1.5 rounded-lg text-xl font-mono font-bold tracking-widest bg-black/90 border-2 ${z.isTargeted ? 'border-[var(--color-accent)] text-white shadow-[0_0_20px_var(--color-accent)]' : 'border-green-900/60 text-green-400'}`}>
                  {z.isTargeted ? (
                    <>
                      <span className="text-[var(--color-accent)] drop-shadow-md">{input}</span>
                      <span className="text-gray-500">{z.word.slice(input.length)}</span>
                    </>
                  ) : (
                    z.word
                  )}
                </div>
              </div>
            ))}
          </div>

          <div className="absolute bottom-12 left-1/2 -translate-x-1/2">
             <div className="text-3xl font-mono tracking-widest text-white h-16 flex items-center justify-center bg-black/80 px-10 py-2 rounded-full border-2 border-gray-800 shadow-2xl backdrop-blur-sm min-w-[200px]">
               {input || <span className="opacity-20 text-sm tracking-[0.3em]">TYPE TO TARGET</span>}
             </div>
          </div>
          
          <input 
            ref={mobileInputRef}
            type="text" 
            className="opacity-0 absolute bottom-0 left-0 w-1 h-1" 
            onChange={handleMobileInput}
          />
          <button 
            onClick={() => mobileInputRef.current?.focus()}
            className="md:hidden absolute bottom-6 right-6 bg-[var(--color-accent)] p-4 rounded-full text-white shadow-lg z-50 cursor-pointer hover:bg-[var(--color-accentHover)]"
          >
            <KeyboardIcon className="w-6 h-6" />
          </button>
        </>
      )}

      {/* Pre-game / Game Over Overlay */}
      <AnimatePresence>
        {(!hasStarted || gameOver) && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={`absolute inset-0 z-50 flex items-center justify-center p-4 ${hasStarted ? 'backdrop-blur-xl bg-red-950/60' : 'bg-[#0a0a0f]'}`}
          >
            <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-3xl max-w-xl w-full text-center shadow-2xl relative overflow-hidden">
              {!hasStarted ? (
                <>
                  <h1 className="text-5xl font-black mb-4 flex items-center justify-center gap-4 tracking-tight">
                    <Skull className="w-10 h-10 text-green-500" />
                    Zombie Mode
                  </h1>
                  <p className="text-[var(--color-textMuted)] mb-10 text-lg leading-relaxed">
                    Type the words above the zombies before they reach the bottom of the screen. Difficulty continuously escalates!
                  </p>
                  <h3 className="text-sm font-bold text-gray-500 uppercase tracking-widest mb-4">Choose Your Theme</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-4">
                    {['marvel', 'anime', 'gaming', 'coding', 'science', 'history', 'sports', 'mythology'].map(topic => (
                      <button 
                        key={topic}
                        onClick={() => handleStart(topic)}
                        className="bg-[var(--color-background)] border border-[var(--color-border)] hover:border-[var(--color-accent)] hover:bg-[var(--color-accent)]/10 hover:text-[var(--color-accent)] p-4 rounded-xl font-bold capitalize transition-all cursor-pointer shadow-sm hover:shadow-md"
                      >
                        {topic}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <div className="absolute -top-16 -left-16 text-[12rem] opacity-5 pointer-events-none">💀</div>
                  <h2 className="text-5xl font-black text-red-500 mb-3 tracking-widest uppercase drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]">Game Over</h2>
                  <p className="text-[var(--color-textMuted)] mb-10 font-medium text-lg">You survived for <span className="text-white font-bold">{Math.floor(difficultyTime / 60)}m {(difficultyTime % 60).toString().padStart(2, '0')}s</span></p>
                  
                  <div className="grid grid-cols-2 gap-4 mb-10 relative z-10">
                    <div className="bg-[#0a0a0f] p-5 rounded-2xl border border-[var(--color-border)] shadow-inner">
                      <div className="text-sm text-gray-500 mb-1 font-semibold uppercase tracking-wider">Final Score</div>
                      <div className="text-4xl font-black text-yellow-400 drop-shadow-md">{score}</div>
                    </div>
                    <div className="bg-[#0a0a0f] p-5 rounded-2xl border border-[var(--color-border)] shadow-inner">
                      <div className="text-sm text-gray-500 mb-1 font-semibold uppercase tracking-wider">Words Defeated</div>
                      <div className="text-4xl font-black text-green-400 drop-shadow-md">{wordsDefeated}</div>
                    </div>
                    <div className="bg-[#0a0a0f] p-5 rounded-2xl border border-[var(--color-border)] shadow-inner">
                      <div className="text-sm text-gray-500 mb-1 font-semibold uppercase tracking-wider">Speed (WPM)</div>
                      <div className="text-4xl font-black text-blue-400 drop-shadow-md">{wpm}</div>
                    </div>
                    <div className="bg-[#0a0a0f] p-5 rounded-2xl border border-[var(--color-border)] shadow-inner">
                      <div className="text-sm text-gray-500 mb-1 font-semibold uppercase tracking-wider">Accuracy</div>
                      <div className="text-4xl font-black text-purple-400 drop-shadow-md">{accuracy}%</div>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 relative z-10">
                    <button 
                      onClick={handleRestart}
                      className="flex-1 bg-[var(--color-accent)] hover:bg-[var(--color-accentHover)] text-white font-bold py-4 rounded-xl flex justify-center items-center gap-3 transition-colors cursor-pointer text-lg shadow-lg"
                    >
                      <RefreshCw className="w-5 h-5" /> Play Again
                    </button>
                    <Link href="/games" className="flex-1 bg-[var(--color-background)] hover:bg-white/5 border border-[var(--color-border)] text-white font-bold py-4 rounded-xl flex justify-center items-center transition-colors text-lg">
                      Exit Game
                    </Link>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes slide {
          from { background-position: 0 0; }
          to { background-position: 0 1000px; }
        }
      `}} />
    </div>
  );
}

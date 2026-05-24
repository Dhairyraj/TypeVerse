'use client';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSpellDuelOnline } from '@/hooks/useSpellDuelOnline';
import { useAuth } from '@/components/Auth/AuthContext';
import { supabase } from '@/lib/supabase';
import { Home, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { HarryMascot } from '@/components/games/HarryMascot';
import { VoldemortMascot } from '@/components/games/VoldemortMascot';

export default function SpellDuelOnlinePage() {
  const { user } = useAuth();
  
  const [joinCode, setJoinCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  
  const { room, error, isPlayer1, countdown, joinRoom, fetchRoom } = useSpellDuelOnline(
    user?.id, 
    user?.user_metadata?.full_name || user?.email?.split('@')[0] || 'Wizard'
  );

  const [sessionSaved, setSessionSaved] = useState(false);

  // Parse URL for room code to allow direct links
  useEffect(() => {
    if (typeof window !== 'undefined' && user) {
      const urlParams = new URLSearchParams(window.location.search);
      const code = urlParams.get('room');
      if (code && !room) {
        joinRoom(code);
      }
    }
  }, [user, room, joinRoom]);

  // Handle saving score at the end
  useEffect(() => {
    if (room?.status === 'gameover' && user && !sessionSaved) {
      setSessionSaved(true);
      const isWinner = room.winner_id === user.id;
      
      const saveScore = async () => {
        try {
          await supabase.from('typing_sessions').insert({
            user_id: user.id,
            interest: 'spell_duel_online',
            difficulty: 'pvp',
            wpm: isWinner ? 1 : 0, // 1 for win, 0 for loss
            accuracy: 100,
            duration_seconds: 0,
            error_count: 0
          });
        } catch (e) {
          console.error("Error saving game score", e);
        }
      };
      saveScore();
    }
  }, [room?.status, room?.winner_id, user, sessionSaved]);

  const handleCreateRoom = async () => {
    if (!user) return;
    setIsCreating(true);
    try {
      const session = await supabase.auth.getSession();
      const token = session.data.session?.access_token ?? '';

      const response = await fetch('/api/spell-duel-room', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId: user.id,
          userName: user.user_metadata?.full_name || user.email?.split('@')[0] || 'Wizard'
        })
      });
      const data = await response.json();
      if (data.roomCode) {
        await fetchRoom(data.roomCode);
        window.history.replaceState({}, '', `?room=${data.roomCode}`);
      }
    } catch (e) {
      console.error(e);
    }
    setIsCreating(false);
  };

  const handleJoinRoom = () => {
    if (joinCode.length === 6) {
      joinRoom(joinCode.toUpperCase());
      window.history.replaceState({}, '', `?room=${joinCode.toUpperCase()}`);
    }
  };

  const copyRoomCode = () => {
    if (room?.room_code) {
      navigator.clipboard.writeText(room.room_code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!user) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 w-full bg-[#050b14]">
        <div className="bg-black/50 p-8 rounded-3xl border border-gray-800 text-center max-w-md w-full">
          <h1 className="text-3xl font-black mb-4 text-white uppercase tracking-widest">Login Required</h1>
          <p className="text-gray-400 mb-6">You must be logged in to play multiplayer duels.</p>
          <Link href="/login" className="bg-blue-600 hover:bg-blue-500 text-white px-8 py-3 rounded-xl font-bold uppercase tracking-widest inline-block transition-colors">
            Log In
          </Link>
        </div>
      </div>
    );
  }

  // Lobby Screen
  if (!room) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 w-full bg-[#050b14]"
           style={{ backgroundImage: 'radial-gradient(circle at center, #0a1128 0%, #010308 100%)' }}>
        <div className="bg-black/60 p-10 rounded-3xl border border-[#2a2a4a] text-center max-w-xl w-full backdrop-blur-md shadow-2xl">
          <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500 drop-shadow-lg tracking-tight mb-2 uppercase">
            Spell Duel Online
          </h1>
          <p className="text-gray-400 mb-10">Challenge a friend to a real-time wand duel.</p>

          {error && (
            <div className="bg-red-900/40 border border-red-500 text-red-300 p-3 rounded-lg mb-6 text-sm font-bold">
              {error}
            </div>
          )}

          <div className="flex flex-col md:flex-row gap-6 justify-center">
            <button 
              onClick={handleCreateRoom}
              disabled={isCreating}
              className="flex-1 bg-gradient-to-r from-blue-600 to-indigo-800 hover:from-blue-500 hover:to-indigo-700 text-white px-6 py-4 rounded-xl font-black text-lg uppercase tracking-widest transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
            >
              {isCreating ? 'Creating...' : 'Create Room'}
            </button>
            
            <div className="flex-1 flex flex-col">
              <input 
                type="text" 
                maxLength={6}
                value={joinCode}
                onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
                placeholder="ROOM CODE" 
                className="w-full bg-gray-900 border border-gray-700 rounded-t-xl px-4 py-3 text-center text-xl font-mono uppercase tracking-widest focus:outline-none focus:border-blue-500 transition-colors"
              />
              <button 
                onClick={handleJoinRoom}
                disabled={joinCode.length !== 6}
                className="w-full bg-gray-800 hover:bg-gray-700 disabled:opacity-50 text-white px-6 py-3 rounded-b-xl font-bold uppercase tracking-widest transition-colors border-x border-b border-gray-700"
              >
                Join
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Waiting Room
  if (room.status === 'waiting') {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-4 w-full bg-[#050b14]"
           style={{ backgroundImage: 'radial-gradient(circle at center, #0a1128 0%, #010308 100%)' }}>
        <div className="bg-black/60 p-10 rounded-3xl border border-[#2a2a4a] max-w-xl w-full backdrop-blur-md shadow-2xl text-center">
          <h2 className="text-3xl font-black mb-6 text-blue-400 uppercase tracking-widest">Waiting Room</h2>
          
          <div className="bg-gray-900 border border-gray-700 rounded-xl p-6 mb-8 relative group cursor-pointer" onClick={copyRoomCode}>
            <div className="text-xs font-bold text-gray-500 mb-2 uppercase tracking-widest">Room Code</div>
            <div className="text-5xl font-mono font-black text-white tracking-[0.2em]">{room.room_code}</div>
            <div className="absolute top-4 right-4 text-gray-400 group-hover:text-white transition-colors">
              {copied ? <CheckCircle className="w-6 h-6 text-green-500" /> : <Copy className="w-6 h-6" />}
            </div>
          </div>

          <div className="space-y-4 text-left">
            <div className="bg-blue-900/20 border border-blue-500/30 p-4 rounded-lg flex items-center gap-3">
              <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
              <span className="font-bold text-white text-lg">{room.player1_name} {isPlayer1 ? '(You)' : ''}</span>
            </div>
            <div className="bg-red-900/10 border border-red-500/20 p-4 rounded-lg flex items-center gap-3 border-dashed">
              <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>
              <span className="font-bold text-gray-400 text-lg italic">Waiting for opponent...</span>
            </div>
          </div>
          
          <p className="mt-8 text-sm text-gray-500">Share the room code with a friend to start the duel!</p>
        </div>
      </div>
    );
  }

  const p1Name = room.player1_name || 'Player 1';
  const p2Name = room.player2_name || 'Player 2';
  
  const myName = isPlayer1 ? p1Name : p2Name;
  const oppName = isPlayer1 ? p2Name : p1Name;

  const myHp = isPlayer1 ? room.player1_hp : room.player2_hp;
  const oppHp = isPlayer1 ? room.player2_hp : room.player1_hp;

  const myProgress = isPlayer1 ? room.player1_progress : room.player2_progress;
  const oppProgress = isPlayer1 ? room.player2_progress : room.player1_progress;

  const beamPos = isPlayer1 ? room.beam_position : 100 - room.beam_position;

  // Game UI
  return (
    <div className="flex-1 flex flex-col p-4 w-full relative bg-[#050b14] overflow-hidden">
      {/* Background with House Colors */}
      <div className="absolute inset-0 flex">
        <div className="w-1/2 h-full bg-gradient-to-r from-[#0a1128] to-[#111827]"></div>
        <div className="w-1/2 h-full bg-gradient-to-l from-[#3a0a0a] to-[#111827]"></div>
      </div>

      {/* Countdown Overlay */}
      <AnimatePresence>
        {countdown !== null && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 2 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm"
          >
            <div className="text-9xl font-black text-transparent bg-clip-text bg-gradient-to-b from-white to-gray-500 drop-shadow-[0_0_40px_rgba(255,255,255,0.5)]">
              {countdown > 0 ? countdown : 'DUEL!'}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* HUD */}
      <div className="absolute top-0 left-0 w-full p-6 flex justify-between items-start z-10 pointer-events-none">
        {/* Player (Left) */}
        <div className="flex flex-col gap-2 w-1/3">
          <div className="text-2xl font-black text-blue-400 uppercase tracking-widest drop-shadow-md">{myName} (You)</div>
          <div className="flex gap-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-3xl drop-shadow-[0_0_10px_rgba(59,130,246,0.5)]">
                {i < myHp ? '⚡' : <span className="opacity-20 grayscale">⚡</span>}
              </div>
            ))}
          </div>
        </div>
        
        {/* Round Counter */}
        <div className="flex flex-col items-center mt-4">
          <div className="bg-black/50 border border-gray-700 px-6 py-2 rounded-full backdrop-blur-sm shadow-xl">
            <span className="text-white font-bold tracking-[0.2em] uppercase text-sm">Round {room.current_round}</span>
          </div>
        </div>

        {/* Opponent (Right) */}
        <div className="flex flex-col items-end gap-2 w-1/3 text-right">
          <div className="text-2xl font-black text-red-500 uppercase tracking-widest drop-shadow-md">{oppName}</div>
          <div className="flex gap-2 flex-row-reverse">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="text-3xl drop-shadow-[0_0_10px_rgba(239,68,68,0.5)]">
                {i < oppHp ? '⚡' : <span className="opacity-20 grayscale">⚡</span>}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Duel Area */}
      {room.status === 'playing' && room.current_spell && (
        <div className="flex-1 flex flex-col justify-center items-center z-10 w-full max-w-6xl mx-auto relative">
          
          {/* Wand Setup & Beam */}
          <div className="w-full flex items-center justify-between relative h-40 mb-16">
            <div className="w-32 h-4 bg-gradient-to-r from-[#4a3525] to-[#2a1a10] rounded-l-full relative z-20 shadow-2xl">
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-blue-300 rounded-full shadow-[0_0_20px_#60a5fa,0_0_40px_#3b82f6]"></div>
            </div>

            <div className="flex-1 h-3 mx-4 relative bg-gray-900 rounded-full overflow-hidden shadow-inner flex">
              <motion.div 
                className="h-full bg-gradient-to-r from-blue-500 to-blue-300 relative shadow-[0_0_15px_#3b82f6]"
                animate={{ width: `${beamPos}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full blur-md opacity-80"></div>
              </motion.div>
              <motion.div 
                className="h-full bg-gradient-to-l from-red-600 to-red-400 relative shadow-[0_0_15px_#ef4444]"
                animate={{ width: `${100 - beamPos}%` }}
                transition={{ type: 'spring', stiffness: 300, damping: 25 }}
              >
                <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full blur-md opacity-80"></div>
              </motion.div>

              <motion.div 
                className="absolute top-1/2 -translate-y-1/2 -ml-8 w-16 h-16 rounded-full mix-blend-screen"
                style={{ left: `${beamPos}%` }}
                animate={{ 
                  left: `${beamPos}%`,
                  scale: [1, 1.2, 0.9, 1.1, 1],
                  rotate: [0, 90, 180, 270, 360]
                }}
                transition={{ duration: 0.5, repeat: Infinity }}
              >
                <div className="absolute inset-0 bg-white rounded-full blur-lg opacity-90"></div>
                <div className="absolute inset-2 bg-yellow-300 rounded-full blur-md"></div>
              </motion.div>
            </div>

            <div className="w-32 h-4 bg-gradient-to-l from-[#1a1a1a] to-[#2a2a2a] rounded-r-full relative z-20 shadow-2xl">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-4 bg-red-400 rounded-full shadow-[0_0_20px_#ef4444,0_0_40px_#dc2626]"></div>
            </div>
          </div>

          {/* Spell Word Display */}
          <div className="bg-black/60 px-12 py-8 rounded-3xl border border-gray-800 backdrop-blur-md shadow-2xl relative">
            <div className="text-5xl md:text-7xl font-mono font-black flex tracking-widest relative z-10">
              {room.current_spell.split('').map((char, i) => {
                let colorClass = "text-gray-600";
                let shadowClass = "";
                
                if (i < myProgress) {
                  colorClass = "text-white";
                  shadowClass = "drop-shadow-[0_0_15px_rgba(255,255,255,0.8)]";
                }
                
                return (
                  <span key={i} className={`${colorClass} ${shadowClass} relative`}>
                    {char}
                    {/* Opponent's progress indicator (red underline/shadow) */}
                    {i === oppProgress && (
                      <motion.div 
                        layoutId="oppCursor"
                        className="absolute bottom-0 left-0 w-full h-1 bg-red-500 shadow-[0_0_10px_#ef4444]"
                      />
                    )}
                  </span>
                );
              })}
            </div>
          </div>
          
          <div className="text-gray-500 mt-6 font-bold tracking-widest uppercase text-sm">
            Type the spell to push the beam!
          </div>
        </div>
      )}

      {/* Game Over Modal */}
      {room.status === 'gameover' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 text-center"
        >
          <div className="bg-[#111] border border-[#333] p-10 rounded-3xl shadow-[0_0_50px_rgba(0,0,0,0.8)] max-w-xl w-full">
            {room.winner_id === user.id ? (
              <>
                <h2 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-yellow-600 mb-2 uppercase tracking-widest">Victory</h2>
                <p className="text-gray-400 mb-8 italic">You defeated {oppName} in a spectacular duel.</p>
              </>
            ) : (
              <>
                <h2 className="text-5xl font-black text-red-600 mb-2 uppercase tracking-widest drop-shadow-[0_0_15px_#dc2626]">Defeat</h2>
                <p className="text-gray-400 mb-8 italic">{oppName} proved too powerful this time.</p>
              </>
            )}

            <div className="flex gap-4 w-full mb-8">
              <div className="flex-1 bg-gray-900 border border-gray-800 p-4 rounded-xl">
                <div className="text-sm text-gray-500 font-bold uppercase mb-1">{myName} (You)</div>
                <div className="text-2xl font-black text-white">{myHp} HP</div>
              </div>
              <div className="flex-1 bg-gray-900 border border-gray-800 p-4 rounded-xl">
                <div className="text-sm text-gray-500 font-bold uppercase mb-1">{oppName}</div>
                <div className="text-2xl font-black text-white">{oppHp} HP</div>
              </div>
            </div>

            <div className="flex flex-col gap-3">
              <button 
                onClick={() => {
                  const shareText = `I ${room.winner_id === user.id ? 'defeated' : 'was defeated by'} ${oppName} in a Spell Duel on TypeVerse! ⚡ https://type-verse-rho.vercel.app/games/spell-duel-online`;
                  window.open(`https://wa.me/?text=${encodeURIComponent(shareText)}`, '_blank');
                }}
                className="w-full bg-[#25D366] hover:bg-[#1ebe57] text-white px-4 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-colors shadow-lg"
              >
                Share on WhatsApp
              </button>
              <Link 
                href="/games"
                className="w-full bg-gray-800 hover:bg-gray-700 text-white px-4 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-colors flex items-center justify-center gap-2"
              >
                <Home className="w-5 h-5" /> Back to Lobby
              </Link>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

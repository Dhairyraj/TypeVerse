'use client';
import { useEffect, useState, useCallback, use } from 'react';
import { useRouter } from 'next/navigation';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import { useWPM } from '@/hooks/useWPM';
import { TypingDisplay } from '@/components/TypingEngine/TypingDisplay';
import { TypingInput } from '@/components/TypingEngine/TypingInput';
import { LiveStats } from '@/components/StatsDisplay/LiveStats';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { Keyboard } from '@/components/KeyboardVisualizer/Keyboard';
import { AnimatePresence, motion } from 'framer-motion';
import { AlertCircle, ArrowLeft, RefreshCw, Keyboard as KeyboardIcon } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from '@/components/Auth/AuthContext';
import { supabase } from '@/lib/supabase';
import { ScoreCard } from '@/components/ScoreCard';

export default function InterestPracticePage({
  params,
}: {
  params: Promise<{ interest: string }>;
}) {
  const { interest } = use(params);
  const router = useRouter();
  
  const [paragraph, setParagraph] = useState('');
  const [mode, setMode] = useState('paragraph');
  const [difficulty, setDifficulty] = useState('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showKeyboard, setShowKeyboard] = useState(false);
  const [sessionSaved, setSessionSaved] = useState(false);
  const [showScoreCard, setShowScoreCard] = useState(false);
  const [scoreDismissed, setScoreDismissed] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const saved = sessionStorage.getItem('typeverse_paragraph');
    const savedMode = sessionStorage.getItem('typeverse_mode');
    const savedDiff = sessionStorage.getItem('typeverse_difficulty');

    if (saved) {
      setParagraph(saved);
      if (savedMode) setMode(savedMode);
      if (savedDiff) setDifficulty(savedDiff);
    } else {
      router.replace('/practice');
    }
  }, [router]);

  const { input, errors, isComplete, handleKeyPress, reset: resetEngine } = useTypingEngine(paragraph);
  const { wpm, accuracy, elapsed, reset: resetWPM } = useWPM(input, errors, isComplete);

  const resetAll = useCallback(() => {
    resetEngine();
    resetWPM();
    setSessionSaved(false);
    setShowScoreCard(false);
    setScoreDismissed(false);
  }, [resetEngine, resetWPM]);

  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        resetAll();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [resetAll]);

  useEffect(() => {
    if (isComplete && user && !sessionSaved) {
      setSessionSaved(true);
      const saveSession = async () => {
        try {
          const wpmVal = wpm;
          const accVal = accuracy;
          const durVal = elapsed;
          const errCount = errors.length;

          await supabase.from('typing_sessions').insert({
            user_id: user.id,
            interest: interest,
            difficulty: mode === 'letters' ? 'none' : difficulty,
            wpm: wpmVal,
            accuracy: accVal,
            duration_seconds: durVal,
            error_count: errCount
          });

          const { data: stats } = await supabase.from('user_stats').select('*').eq('user_id', user.id).single();
          const newTotalSessions = (stats?.total_sessions || 0) + 1;
          const newBestWpm = Math.max(stats?.best_wpm || 0, wpmVal);
          const newTotalTime = (stats?.total_time_minutes || 0) + (durVal / 60);
          const newAverageWpm = ((stats?.average_wpm || 0) * (stats?.total_sessions || 0) + wpmVal) / newTotalSessions;

          await supabase.from('user_stats').upsert({
            user_id: user.id,
            best_wpm: newBestWpm,
            average_wpm: newAverageWpm,
            total_sessions: newTotalSessions,
            total_time_minutes: newTotalTime,
            last_practiced: new Date().toISOString().split('T')[0]
          });
        } catch (e) {
          console.error("Error saving session", e);
        }
      };
      saveSession();
    }
    
    if (isComplete && !scoreDismissed) {
      const timer = setTimeout(() => setShowScoreCard(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isComplete, user, sessionSaved, wpm, accuracy, elapsed, errors.length, interest, difficulty, mode, scoreDismissed]);

  const handleCloseScoreCard = () => {
    setShowScoreCard(false);
    setScoreDismissed(true);
  };

  const generateNewParagraph = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-paragraph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interest, difficulty: mode === 'letters' ? undefined : difficulty, mode })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate');
      }
      
      sessionStorage.setItem('typeverse_paragraph', data.paragraph);
      setParagraph(data.paragraph);
      resetAll();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!paragraph && !error && !loading) {
    return null; // Wait for initial sessionStorage read
  }

  return (
    <div className="flex-1 flex flex-col items-center p-8 max-w-4xl mx-auto w-full relative">
      <div className="w-full flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
        <Link href="/practice" className="flex items-center gap-2 text-[var(--color-textMuted)] hover:text-[var(--color-textPrimary)] transition-colors">
          <ArrowLeft className="w-4 h-4" />
          <span>Change Practice</span>
        </Link>
        <div className="flex flex-col sm:items-center">
          <h1 className="text-2xl font-bold capitalize">{interest} Mode</h1>
          <div className="flex items-center gap-2 text-sm text-[var(--color-textMuted)] mt-1 font-medium">
            <span className="capitalize">{mode}</span>
            {mode !== 'letters' && (
              <>
                <span>&middot;</span>
                <span className="capitalize">{difficulty}</span>
              </>
            )}
          </div>
        </div>
        <div className="flex gap-4">
          <button
            onClick={() => setShowKeyboard(s => !s)}
            className="flex items-center gap-2 text-[var(--color-textMuted)] hover:text-[var(--color-textPrimary)] transition-colors font-medium cursor-pointer"
          >
            <KeyboardIcon className="w-4 h-4" />
            <span>{showKeyboard ? 'Hide Guide' : 'Show Guide'}</span>
          </button>
          <button 
            onClick={generateNewParagraph}
            disabled={loading}
            className="flex items-center gap-2 text-[var(--color-accent)] hover:text-[var(--color-accentHover)] transition-colors font-medium disabled:opacity-50 cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            <span>New Paragraph</span>
          </button>
        </div>
      </div>
      
      {error && (
        <div className="w-full mb-8 p-4 bg-[var(--color-error)]/10 border border-[var(--color-error)] text-[var(--color-error)] rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Oops! Something went wrong.</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
          <button 
            onClick={generateNewParagraph}
            className="px-4 py-2 bg-[var(--color-error)] text-white rounded-md font-medium hover:bg-[var(--color-error)]/80 transition-colors shrink-0 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}

      {loading ? (
        <div className="w-full p-12 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl mt-4">
          <h3 className="text-[var(--color-textMuted)] font-medium mb-8 text-center">Generating new {interest} content...</h3>
          <SkeletonLoader />
        </div>
      ) : paragraph && !error ? (
        <>
          <LiveStats wpm={wpm} accuracy={accuracy} elapsed={elapsed} errors={errors.length} />
          
          <AnimatePresence>
            {showKeyboard && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="w-full overflow-hidden mb-6"
              >
                <div className="pt-2 pb-4">
                  <Keyboard 
                    activeChar={input.length < paragraph.length ? paragraph[input.length] : null} 
                    mode={mode} 
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="w-full relative bg-[var(--color-surface)] p-8 rounded-xl border border-[var(--color-border)] shadow-lg overflow-hidden flex flex-col">
            <TypingDisplay targetText={paragraph} input={input} errors={errors} />
            <TypingInput onKeyPress={handleKeyPress} />
          </div>
          <div className="mt-8 text-[var(--color-textMuted)] text-sm flex gap-4">
            <span className="flex items-center gap-1"><kbd className="bg-[var(--color-border)] px-2 py-1 rounded text-[var(--color-textPrimary)] font-mono text-xs">Esc</kbd> to reset</span>
          </div>
          
          <ScoreCard 
            isOpen={showScoreCard} 
            onClose={handleCloseScoreCard} 
            wpm={wpm} 
            accuracy={accuracy} 
            interest={interest} 
          />
        </>
      ) : null}
    </div>
  );
}

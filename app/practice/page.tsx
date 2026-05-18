'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { InterestGrid } from '@/components/InterestSelector/InterestGrid';
import { DifficultyPicker } from '@/components/InterestSelector/DifficultyPicker';
import { ModePicker, Mode } from '@/components/InterestSelector/ModePicker';
import { SkeletonLoader } from '@/components/SkeletonLoader';
import { AlertCircle } from 'lucide-react';

type Difficulty = 'easy' | 'medium' | 'hard';

export default function PracticePage() {
  const router = useRouter();
  const [mode, setMode] = useState<Mode>('paragraph');
  const [interest, setInterest] = useState('marvel');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleStart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-paragraph', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ interest, difficulty, mode })
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate');
      }
      
      sessionStorage.setItem('typeverse_paragraph', data.paragraph);
      sessionStorage.setItem('typeverse_difficulty', difficulty);
      sessionStorage.setItem('typeverse_mode', mode);
      
      router.push(`/practice/${interest}`);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 flex flex-col items-center p-8 max-w-4xl mx-auto w-full">
      <h1 className="text-4xl font-bold mb-4 text-center">Choose Your Practice</h1>
      <p className="text-[var(--color-textMuted)] mb-12 text-center max-w-lg">
        Select your typing mode, a topic, and difficulty. Our AI will generate custom content just for you.
      </p>
      
      <div className="w-full mb-10">
        <h2 className="text-xl font-semibold mb-4 w-full">Mode</h2>
        <ModePicker selected={mode} onSelect={setMode} />
      </div>

      <div className="w-full mb-10">
        <h2 className="text-xl font-semibold mb-4">Topic</h2>
        <InterestGrid selected={interest} onSelect={setInterest} />
      </div>
      
      {mode !== 'letters' && (
        <div className="w-full mb-12 flex flex-col items-start transition-all">
          <h2 className="text-xl font-semibold mb-4 w-full">Difficulty</h2>
          <DifficultyPicker selected={difficulty} onSelect={setDifficulty} />
        </div>
      )}
      
      {error && (
        <div className="w-full mb-8 p-4 bg-[var(--color-error)]/10 border border-[var(--color-error)] text-[var(--color-error)] rounded-lg flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div className="flex-1">
            <p className="font-semibold">Oops! Something went wrong.</p>
            <p className="text-sm opacity-90">{error}</p>
          </div>
          <button 
            onClick={handleStart}
            className="px-4 py-2 bg-[var(--color-error)] text-white rounded-md font-medium hover:bg-[var(--color-error)]/80 transition-colors shrink-0 cursor-pointer"
          >
            Try Again
          </button>
        </div>
      )}
      
      {loading ? (
        <div className="w-full p-8 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl mt-4">
          <h3 className="text-[var(--color-textMuted)] font-medium mb-6 text-center">Generating AI Content...</h3>
          <SkeletonLoader />
        </div>
      ) : (
        <button 
          onClick={handleStart}
          disabled={loading}
          className="bg-[var(--color-accent)] hover:bg-[var(--color-accentHover)] text-white px-8 py-4 rounded-xl font-bold text-lg transition-colors w-full md:w-auto md:min-w-[300px] cursor-pointer mt-4"
        >
          Start Typing
        </button>
      )}
    </div>
  );
}

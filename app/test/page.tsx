'use client';
import { useEffect, useCallback } from 'react';
import { useTypingEngine } from '@/hooks/useTypingEngine';
import { useWPM } from '@/hooks/useWPM';
import { TypingDisplay } from '@/components/TypingEngine/TypingDisplay';
import { TypingInput } from '@/components/TypingEngine/TypingInput';
import { LiveStats } from '@/components/StatsDisplay/LiveStats';

const HARDCODED_PARAGRAPH = "The rapid development of artificial intelligence has transformed how we interact with technology. From natural language processing to computer vision, AI systems are becoming increasingly integrated into our daily lives, offering new solutions to complex problems while simultaneously raising important questions about ethics, privacy, and the future of human-computer interaction.";

export default function TestPage() {
  const { input, errors, isComplete, handleKeyPress, reset: resetEngine } = useTypingEngine(HARDCODED_PARAGRAPH);
  const { wpm, accuracy, elapsed, reset: resetWPM } = useWPM(input, errors, isComplete);

  const resetAll = useCallback(() => {
    resetEngine();
    resetWPM();
  }, [resetEngine, resetWPM]);

  // Handle Escape explicitly for resets
  useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        resetAll();
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, [resetAll]);

  // Handle Tab + Enter explicitly
  useEffect(() => {
    let tabPressed = false;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        tabPressed = true;
        e.preventDefault(); // Prevent focus switch so Enter can be caught easily
      }
      if (e.key === 'Enter' && tabPressed) {
        e.preventDefault();
        resetAll();
      }
    };
    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Tab') {
        tabPressed = false;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [resetAll]);

  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 max-w-4xl mx-auto w-full relative">
      <h1 className="text-3xl font-bold mb-8">Typing Engine Test</h1>
      
      <LiveStats wpm={wpm} accuracy={accuracy} elapsed={elapsed} errors={errors.length} />
      
      <div className="w-full relative bg-[var(--color-surface)] p-8 rounded-xl border border-[var(--color-border)] shadow-lg overflow-hidden flex flex-col">
        <TypingDisplay targetText={HARDCODED_PARAGRAPH} input={input} errors={errors} />
        <TypingInput onKeyPress={handleKeyPress} />
      </div>
      
      <div className="mt-8 text-[var(--color-textMuted)] text-sm flex gap-4">
        <span className="flex items-center gap-1"><kbd className="bg-[var(--color-border)] px-2 py-1 rounded text-[var(--color-textPrimary)] font-mono text-xs">Tab</kbd> + <kbd className="bg-[var(--color-border)] px-2 py-1 rounded text-[var(--color-textPrimary)] font-mono text-xs">Enter</kbd> to restart</span>
        <span className="flex items-center gap-1"><kbd className="bg-[var(--color-border)] px-2 py-1 rounded text-[var(--color-textPrimary)] font-mono text-xs">Esc</kbd> to reset</span>
      </div>
    </div>
  );
}

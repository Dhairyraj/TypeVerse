'use client';
import { motion, AnimatePresence } from 'framer-motion';

interface LiveStatsProps {
  wpm: number;
  accuracy: number;
  elapsed: number;
  errors: number;
}

const StatBox = ({ label, value }: { label: string; value: string | number }) => (
  <div className="flex flex-col items-center p-4 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-lg min-w-[100px] shadow-sm">
    <span className="text-[var(--color-textMuted)] text-xs font-bold uppercase tracking-widest mb-1">{label}</span>
    <div className="h-8 overflow-hidden relative w-full flex justify-center items-center">
      <AnimatePresence mode="popLayout">
        <motion.span
          key={value}
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -20, opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="text-2xl font-bold text-[var(--color-textPrimary)] absolute"
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </div>
  </div>
);

export function LiveStats({ wpm, accuracy, elapsed, errors }: LiveStatsProps) {
  return (
    <div className="flex gap-4 mb-8">
      <StatBox label="WPM" value={wpm} />
      <StatBox label="Accuracy" value={`${accuracy}%`} />
      <StatBox label="Time" value={`${elapsed}s`} />
      <StatBox label="Errors" value={errors} />
    </div>
  );
}

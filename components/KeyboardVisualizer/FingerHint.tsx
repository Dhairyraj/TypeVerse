'use client';
import { motion, AnimatePresence } from 'framer-motion';
import { Finger } from './keyboardData';

interface FingerHintProps {
  activeFinger: Finger | null;
}

const FINGER_LABELS: Record<Finger, string> = {
  'l-pinky': 'LEFT PINKY',
  'l-ring': 'LEFT RING',
  'l-middle': 'LEFT MIDDLE',
  'l-index': 'LEFT INDEX',
  'l-thumb': 'LEFT THUMB',
  'r-thumb': 'RIGHT THUMB',
  'r-index': 'RIGHT INDEX',
  'r-middle': 'RIGHT MIDDLE',
  'r-ring': 'RIGHT RING',
  'r-pinky': 'RIGHT PINKY',
};

export function FingerHint({ activeFinger }: FingerHintProps) {
  return (
    <div className="h-10 flex items-center justify-center mt-6">
      <AnimatePresence mode="wait">
        {activeFinger && (
          <motion.div
            key={activeFinger}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-[var(--color-textPrimary)] font-medium bg-[var(--color-surface)] px-5 py-2 rounded-full border border-[var(--color-border)] shadow-sm"
          >
            Use your <span className="font-bold text-[var(--color-accent)]">{FINGER_LABELS[activeFinger]}</span> finger
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

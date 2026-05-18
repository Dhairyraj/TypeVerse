'use client';
import clsx from 'clsx';
import { motion } from 'framer-motion';

type Difficulty = 'easy' | 'medium' | 'hard';

interface DifficultyPickerProps {
  selected: Difficulty;
  onSelect: (diff: Difficulty) => void;
}

export function DifficultyPicker({ selected, onSelect }: DifficultyPickerProps) {
  const difficulties: { id: Difficulty; label: string; colorClass: string }[] = [
    { id: 'easy', label: 'Easy', colorClass: 'text-[var(--color-success)] border-[var(--color-success)] bg-[var(--color-success)]/10' },
    { id: 'medium', label: 'Medium', colorClass: 'text-[var(--color-warning)] border-[var(--color-warning)] bg-[var(--color-warning)]/10' },
    { id: 'hard', label: 'Hard', colorClass: 'text-[var(--color-error)] border-[var(--color-error)] bg-[var(--color-error)]/10' },
  ];

  return (
    <div className="flex gap-4">
      {difficulties.map((diff) => {
        const isSelected = selected === diff.id;
        return (
          <motion.button
            key={diff.id}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => onSelect(diff.id)}
            className={clsx(
              "px-6 py-2 rounded-full border font-medium transition-colors cursor-pointer",
              isSelected 
                ? diff.colorClass 
                : "border-[var(--color-border)] text-[var(--color-textMuted)] hover:text-[var(--color-textPrimary)] hover:border-[var(--color-textPrimary)] bg-[var(--color-surface)]"
            )}
          >
            {diff.label}
          </motion.button>
        );
      })}
    </div>
  );
}

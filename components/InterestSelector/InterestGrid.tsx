'use client';
import { motion } from 'framer-motion';
import { 
  Sword, Tv, Gamepad2, Code, 
  FlaskConical, Landmark, Trophy, BookOpen 
} from 'lucide-react';
import clsx from 'clsx';

const interests = [
  { id: 'marvel', label: 'Marvel', icon: Sword },
  { id: 'anime', label: 'Anime', icon: Tv },
  { id: 'gaming', label: 'Gaming', icon: Gamepad2 },
  { id: 'coding', label: 'Coding', icon: Code },
  { id: 'science', label: 'Science', icon: FlaskConical },
  { id: 'history', label: 'History', icon: Landmark },
  { id: 'sports', label: 'Sports', icon: Trophy },
  { id: 'mythology', label: 'Mythology', icon: BookOpen },
];

interface InterestGridProps {
  selected: string;
  onSelect: (id: string) => void;
}

export function InterestGrid({ selected, onSelect }: InterestGridProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full">
      {interests.map((interest) => {
        const Icon = interest.icon;
        const isSelected = selected === interest.id;
        
        return (
          <motion.button
            key={interest.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(interest.id)}
            className={clsx(
              "flex flex-col items-center justify-center p-6 rounded-xl border transition-colors",
              isSelected 
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-[0_0_15px_rgba(108,99,255,0.1)]" 
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-textPrimary)] hover:border-[var(--color-textMuted)]"
            )}
          >
            <Icon className="w-8 h-8 mb-3" />
            <span className="font-medium">{interest.label}</span>
          </motion.button>
        );
      })}
    </div>
  );
}

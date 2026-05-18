'use client';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { Type, FileText, AlignLeft } from 'lucide-react';

export type Mode = 'letters' | 'words' | 'paragraph';

interface ModePickerProps {
  selected: Mode;
  onSelect: (mode: Mode) => void;
}

export function ModePicker({ selected, onSelect }: ModePickerProps) {
  const modes = [
    { 
      id: 'letters' as Mode, 
      label: 'Letters', 
      desc: 'Home row keys only, perfect for beginners',
      icon: Type
    },
    { 
      id: 'words' as Mode, 
      label: 'Words', 
      desc: 'Interest-themed word lists',
      icon: AlignLeft
    },
    { 
      id: 'paragraph' as Mode, 
      label: 'Paragraph', 
      desc: 'Full sentences, real challenge',
      icon: FileText
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
      {modes.map((mode) => {
        const Icon = mode.icon;
        const isSelected = selected === mode.id;
        
        return (
          <motion.button
            key={mode.id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(mode.id)}
            className={clsx(
              "flex flex-col items-start p-5 rounded-xl border text-left transition-colors cursor-pointer",
              isSelected 
                ? "border-[var(--color-accent)] bg-[var(--color-accent)]/10 text-[var(--color-accent)] shadow-[0_0_15px_rgba(108,99,255,0.1)]" 
                : "border-[var(--color-border)] bg-[var(--color-surface)] text-[var(--color-textPrimary)] hover:border-[var(--color-textMuted)] hover:text-[var(--color-textPrimary)]"
            )}
          >
            <div className="flex items-center gap-2 mb-2 font-bold text-lg">
              <Icon className="w-5 h-5" />
              <span>{mode.label}</span>
            </div>
            <span className={clsx("text-sm", isSelected ? "text-[var(--color-accent)]/80" : "text-[var(--color-textMuted)]")}>
              {mode.desc}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}

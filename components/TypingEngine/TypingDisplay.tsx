'use client';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface TypingDisplayProps {
  targetText: string;
  input: string;
  errors: number[];
}

export function TypingDisplay({ targetText, input, errors }: TypingDisplayProps) {
  const characters = targetText.split('');
  const currentIndex = input.length;

  return (
    <div className="font-mono text-2xl leading-relaxed whitespace-pre-wrap break-words relative w-full select-none" style={{ fontFamily: 'var(--font-mono)' }}>
      {characters.map((char, index) => {
        const isUntyped = index >= currentIndex;
        const isError = errors.includes(index);
        const isCorrect = !isUntyped && !isError;
        const isCurrent = index === currentIndex;
        
        return (
          <span key={index} className="relative inline-block">
            {isCurrent && (
              <motion.span
                className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--color-accent)] -ml-[1px]"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ repeat: Infinity, duration: 0.8 }}
              />
            )}
            <span
              className={clsx(
                "transition-colors duration-100",
                isUntyped && "text-[var(--color-textMuted)]",
                isCorrect && "text-[var(--color-textPrimary)]",
                isError && "bg-[var(--color-error)]/30 text-[var(--color-error)]"
              )}
            >
              {char}
            </span>
          </span>
        );
      })}
      {/* Handle cursor when at the very end */}
      {currentIndex === targetText.length && (
         <span className="relative">
             <motion.span
               className="absolute left-0 top-0 bottom-0 w-[2px] bg-[var(--color-accent)] -ml-[1px]"
               animate={{ opacity: [1, 0, 1] }}
               transition={{ repeat: Infinity, duration: 0.8 }}
             />
         </span>
      )}
    </div>
  );
}

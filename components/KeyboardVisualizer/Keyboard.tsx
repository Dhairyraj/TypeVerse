'use client';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import { KEY_TO_FINGER, FINGER_COLORS, FINGER_COLORS_ACTIVE, HOME_ROW_KEYS, KEYBOARD_ROWS, Finger } from './keyboardData';
import { Hands } from './Hands';
import { FingerHint } from './FingerHint';

interface KeyboardProps {
  activeChar: string | null;
  mode?: 'letters' | 'words' | 'paragraph' | string | null;
  interactive?: boolean;
  onKeyClick?: (keyId: string) => void;
  clickedFinger?: Finger | null;
}

export function Keyboard({ activeChar, mode, interactive, onKeyClick, clickedFinger }: KeyboardProps) {
  const charFinger = activeChar ? KEY_TO_FINGER[activeChar.toLowerCase()] : null;
  const activeFinger = interactive ? clickedFinger : charFinger;

  return (
    <div className="flex flex-col items-center select-none w-full max-w-4xl mx-auto bg-[#0a0a0f] p-8 rounded-2xl border border-[var(--color-border)] shadow-2xl relative overflow-hidden">
      <div className="flex flex-col gap-2 w-full items-center z-10">
        {KEYBOARD_ROWS.map((row, rIdx) => (
          <div key={rIdx} className="flex gap-2">
            {row.map((k) => {
              const finger = KEY_TO_FINGER[k.id];
              const isTarget = !interactive && activeChar && activeChar.toLowerCase() === k.id;
              const belongsToClicked = interactive && clickedFinger === finger;
              const isHighlight = isTarget || belongsToClicked;

              const isLettersMode = mode === 'letters';
              const isHomeRow = HOME_ROW_KEYS.includes(k.id);
              const isDimmed = isLettersMode && !isHomeRow && !isHighlight;

              return (
                <motion.div
                  key={k.id}
                  onClick={() => interactive && onKeyClick && onKeyClick(k.id)}
                  whileHover={interactive ? { scale: 1.05 } : {}}
                  whileTap={interactive ? { scale: 0.95 } : {}}
                  className={clsx(
                    "h-12 border-b-[3px] rounded-lg flex items-center justify-center font-bold text-sm transition-all duration-200 border-x border-t",
                    k.width || "w-12",
                    isHighlight ? FINGER_COLORS_ACTIVE[finger] : FINGER_COLORS[finger],
                    isDimmed ? "opacity-20 grayscale" : "opacity-100",
                    interactive ? "cursor-pointer" : "cursor-default"
                  )}
                  data-finger={finger}
                >
                  {k.key}
                </motion.div>
              );
            })}
          </div>
        ))}
      </div>
      
      <div className="z-10 w-full">
        {!interactive && <FingerHint activeFinger={activeFinger || null} />}
        <Hands activeFinger={activeFinger || null} />
      </div>
    </div>
  );
}

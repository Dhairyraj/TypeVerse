'use client';
import { useState } from 'react';
import { Keyboard } from '@/components/KeyboardVisualizer/Keyboard';
import { Finger, KEY_TO_FINGER } from '@/components/KeyboardVisualizer/keyboardData';

export default function LearnPage() {
  const [clickedFinger, setClickedFinger] = useState<Finger | null>(null);

  const handleKeyClick = (keyId: string) => {
    const finger = KEY_TO_FINGER[keyId];
    if (finger) setClickedFinger(finger);
  };

  return (
    <div className="flex-1 flex flex-col items-center p-8 max-w-5xl mx-auto w-full">
      <h1 className="text-4xl font-bold mb-4">10-Finger Typing Guide</h1>
      <p className="text-[var(--color-textMuted)] mb-12 text-center max-w-2xl leading-relaxed">
        Click any key on the interactive keyboard below to see which finger is responsible for it. 
        Learning proper finger placement is the absolute secret to blazing fast typing speed!
      </p>

      <div className="w-full mb-16">
        <Keyboard 
          activeChar={null} 
          interactive={true} 
          onKeyClick={handleKeyClick} 
          clickedFinger={clickedFinger} 
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
        <Section title="1. Home Row" desc="ASDF JKL; are your anchor keys. Always rest your fingers here naturally." />
        <Section title="2. Top Row" desc="Reach up slightly without lifting your wrists to hit QWERTY keys." />
        <Section title="3. Bottom Row" desc="Curl your fingers down inwards to reach the bottom row comfortably." />
        <Section title="4. Numbers" desc="Use the exact same fingers as the top row, but stretch slightly further up." />
        <Section className="md:col-span-2" title="5. Speed Tips" desc="Don't look at the keyboard! Let muscle memory take over. Start slow and focus purely on accuracy, speed will come naturally." />
      </div>
    </div>
  );
}

function Section({ title, desc, className = '' }: { title: string, desc: string, className?: string }) {
  return (
    <div className={clsx("p-6 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl", className)}>
      <h3 className="text-lg font-bold mb-2 text-[var(--color-accent)]">{title}</h3>
      <p className="text-[var(--color-textMuted)]">{desc}</p>
    </div>
  );
}

import clsx from 'clsx';

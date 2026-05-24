import React from 'react';

interface MascotProps {
  className?: string;
}

export function SnapeMascot({ className = '' }: MascotProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Robe */}
      <path d="M30 120 L90 120 L80 80 L40 80 Z" fill="#111" />
      {/* High collar */}
      <path d="M45 85 L75 85 L70 75 L50 75 Z" fill="#222" />
      
      {/* Face (Pale) */}
      <circle cx="60" cy="55" r="30" fill="#fdf5e6" />
      
      {/* Hair (Black, greasy, straight) */}
      <path d="M30 55 C30 20, 90 20, 90 55 C95 80, 85 90, 85 90 C85 90, 80 50, 75 35 C70 30, 50 30, 45 35 C40 50, 35 90, 35 90 C35 90, 25 80, 30 55 Z" fill="#0a0a0a" />
      
      {/* Eyebrows (Angry/grumpy) */}
      <line x1="45" y1="45" x2="55" y2="50" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
      <line x1="75" y1="45" x2="65" y2="50" stroke="#111" strokeWidth="2.5" strokeLinecap="round" />
      
      {/* Eyes (Dark, narrow) */}
      <ellipse cx="50" cy="53" rx="4" ry="2" fill="#111" />
      <ellipse cx="70" cy="53" rx="4" ry="2" fill="#111" />
      
      {/* Hooked Nose */}
      <path d="M60 53 C60 53, 65 62, 58 65" fill="none" stroke="#dcbba8" strokeWidth="2" strokeLinecap="round" />
      
      {/* Mouth (Sneer) */}
      <path d="M52 75 Q60 70 68 73" fill="none" stroke="#333" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

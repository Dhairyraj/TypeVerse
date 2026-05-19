import React from 'react';

interface MascotProps {
  className?: string;
}

export function VoldemortMascot({ className = '' }: MascotProps) {
  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Robe */}
      <path d="M40 100 L15 120 L105 120 L80 100 Z" fill="#111" />
      
      {/* Head */}
      <circle cx="60" cy="55" r="30" fill="#E0E0E0" />
      
      {/* Slit Nostrils */}
      <line x1="57" y1="60" x2="59" y2="65" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="63" y1="60" x2="61" y2="65" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
      
      {/* Red Eyes */}
      <circle cx="48" cy="50" r="4" fill="#D32F2F" />
      <circle cx="72" cy="50" r="4" fill="#D32F2F" />
      <circle cx="48" cy="50" r="1.5" fill="#111" />
      <circle cx="72" cy="50" r="1.5" fill="#111" />
      
      {/* Angry Eyebrows */}
      <line x1="40" y1="42" x2="52" y2="46" stroke="#555" strokeWidth="2" strokeLinecap="round" />
      <line x1="80" y1="42" x2="68" y2="46" stroke="#555" strokeWidth="2" strokeLinecap="round" />
      
      {/* Mouth (frown) */}
      <path d="M52 75 Q60 70 68 75" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" />
      
      {/* Wand Arm */}
      <path d="M80 100 L105 85" stroke="#111" strokeWidth="8" strokeLinecap="round" />
      <line x1="105" y1="85" x2="115" y2="65" stroke="#E0E0E0" strokeWidth="4" strokeLinecap="round" />
      
      {/* Magic Star (Green) */}
      <polygon points="115,55 118,62 125,62 120,67 122,74 115,70 108,74 110,67 105,62 112,62" fill="#4CAF50" />
    </svg>
  );
}

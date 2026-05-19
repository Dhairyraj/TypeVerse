import React from 'react';

export type House = 'gryffindor' | 'slytherin' | 'hufflepuff' | 'ravenclaw';

interface MascotProps {
  house?: House;
  className?: string;
}

export function HarryMascot({ house = 'gryffindor', className = '' }: MascotProps) {
  const houseColors = {
    gryffindor: { primary: '#7F0909', secondary: '#FFC500' },
    slytherin: { primary: '#0D6217', secondary: '#AAAAAA' },
    hufflepuff: { primary: '#EEE117', secondary: '#000000' },
    ravenclaw: { primary: '#000A90', secondary: '#946B2D' }
  };
  
  const colors = houseColors[house] || houseColors.gryffindor;

  return (
    <svg viewBox="0 0 120 120" className={className} xmlns="http://www.w3.org/2000/svg">
      {/* Robe */}
      <path d="M40 100 L20 120 L100 120 L80 100 Z" fill="#222" />
      {/* Scarf / Collar */}
      <rect x="45" y="85" width="30" height="15" fill={colors.primary} />
      <rect x="50" y="85" width="5" height="15" fill={colors.secondary} />
      <rect x="65" y="85" width="5" height="15" fill={colors.secondary} />
      
      {/* Head */}
      <circle cx="60" cy="55" r="30" fill="#FFE0BD" />
      
      {/* Hair */}
      <path d="M30 55 C30 20, 90 20, 90 55 C95 40, 70 20, 60 25 C50 20, 25 40, 30 55 Z" fill="#111" />
      <path d="M60 25 Q65 35 70 30 Q65 20 60 25 Z" fill="#111" /> {/* Messy tuft */}
      
      {/* Scar */}
      <path d="M65 35 L60 42 L63 42 L58 50" stroke="#D32F2F" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round" />
      
      {/* Glasses */}
      <circle cx="48" cy="55" r="10" fill="none" stroke="#222" strokeWidth="3" />
      <circle cx="72" cy="55" r="10" fill="none" stroke="#222" strokeWidth="3" />
      <line x1="58" y1="55" x2="62" y2="55" stroke="#222" strokeWidth="3" />
      
      {/* Eyes */}
      <circle cx="48" cy="55" r="3" fill="#111" />
      <circle cx="72" cy="55" r="3" fill="#111" />
      
      {/* Smile */}
      <path d="M55 70 Q60 75 65 70" fill="none" stroke="#222" strokeWidth="2" strokeLinecap="round" />
      
      {/* Wand Arm */}
      <path d="M80 100 L105 85" stroke="#222" strokeWidth="8" strokeLinecap="round" />
      <line x1="105" y1="85" x2="115" y2="65" stroke="#8B4513" strokeWidth="4" strokeLinecap="round" />
      
      {/* Magic Star */}
      <polygon points="115,55 118,62 125,62 120,67 122,74 115,70 108,74 110,67 105,62 112,62" fill="#FFD700" />
    </svg>
  );
}

'use client';
import { useEffect, useRef } from 'react';

interface TypingInputProps {
  onKeyPress: (key: string) => void;
}

export function TypingInput({ onKeyPress }: TypingInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Auto focus on mount
    inputRef.current?.focus();
    
    // Refocus on window click
    const handleWindowClick = () => inputRef.current?.focus();
    window.addEventListener('click', handleWindowClick);
    
    return () => window.removeEventListener('click', handleWindowClick);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' || e.key === 'Escape' || e.key === 'Enter') {
      // Let global handlers handle these
      return; 
    }
    
    if (e.metaKey || e.ctrlKey || e.altKey) {
       return; // ignore copy/paste combinations
    }
    
    e.preventDefault();
    onKeyPress(e.key);
  };

  return (
    <div className="absolute top-0 left-0 w-full h-full opacity-0 pointer-events-none sm:pointer-events-auto sm:z-10">
      <input
        ref={inputRef}
        type="text"
        className="w-full h-full cursor-default bg-transparent text-transparent caret-transparent border-none outline-none"
        onKeyDown={handleKeyDown}
        autoComplete="off"
        autoCapitalize="off"
        autoCorrect="off"
        spellCheck="false"
      />
    </div>
  );
}

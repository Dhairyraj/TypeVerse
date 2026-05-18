import { useState, useCallback } from 'react';

export function useTypingEngine(targetText: string) {
  const [input, setInput] = useState('');
  const [errors, setErrors] = useState<number[]>([]);
  
  const currentIndex = input.length;
  const isComplete = currentIndex >= targetText.length;
  
  const handleKeyPress = useCallback((key: string) => {
    if (isComplete && key !== 'Backspace') return;
    
    // Ignore control keys, but allow Backspace
    if (key === 'Tab' || key === 'Enter' || key === 'Escape') {
      return;
    }

    if (key.length > 1 && key !== 'Backspace') {
      // Ignore other special keys (Shift, CapsLock, Arrow keys, etc.)
      return;
    }

    if (key === 'Backspace') {
      setInput((prev) => {
        if (prev.length === 0) return prev;
        const next = prev.slice(0, -1);
        // Remove error if we're backspacing over an error
        setErrors((prevErrors) => prevErrors.filter(i => i < next.length));
        return next;
      });
      return;
    }
    
    // Stop accepting characters if we reach the end
    if (currentIndex >= targetText.length) {
       return;
    }

    // Key is a single character
    const expectedChar = targetText[currentIndex];
    
    if (key !== expectedChar) {
      setErrors((prev) => {
        if (!prev.includes(currentIndex)) {
          return [...prev, currentIndex];
        }
        return prev;
      });
    }
    
    setInput((prev) => prev + key);
  }, [currentIndex, isComplete, targetText]);
  
  const reset = useCallback(() => {
    setInput('');
    setErrors([]);
  }, []);
  
  return {
    input,
    currentIndex,
    errors,
    isComplete,
    handleKeyPress,
    reset
  };
}

import { useState, useEffect, useCallback } from 'react';

export function useWPM(input: string, errors: number[], isComplete: boolean) {
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsed, setElapsed] = useState(0);
  
  useEffect(() => {
    if (input.length === 1 && !startTime) {
      setStartTime(Date.now());
    }
  }, [input, startTime]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (startTime && !isComplete) {
      interval = setInterval(() => {
        setElapsed(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [startTime, isComplete]);
  
  const calculateWPM = () => {
    if (!startTime || elapsed === 0) return 0;
    const minutes = elapsed / 60;
    const chars = input.length;
    return Math.max(0, Math.round((chars / 5) / minutes));
  };
  
  const calculateAccuracy = () => {
    if (input.length === 0) return 100;
    const correctChars = input.length - errors.length;
    return Math.max(0, Math.round((correctChars / input.length) * 100));
  };
  
  const reset = useCallback(() => {
    setStartTime(null);
    setElapsed(0);
  }, []);
  
  return {
    wpm: calculateWPM(),
    accuracy: calculateAccuracy(),
    elapsed,
    reset
  };
}

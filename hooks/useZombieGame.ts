import { useState, useEffect, useRef, useCallback } from 'react';
import { getRandomWord } from '@/lib/wordBank';

export interface Zombie {
  id: string;
  word: string;
  x: number;
  y: number;
  speed: number;
  isTargeted: boolean;
}

export function useZombieGame(interest: string = '') {
  const [zombies, setZombies] = useState<Zombie[]>([]);
  const [lives, setLives] = useState(3);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [input, setInput] = useState('');
  const [difficultyTime, setDifficultyTime] = useState(0);
  const [wordsDefeated, setWordsDefeated] = useState(0);
  const [totalCharsTyped, setTotalCharsTyped] = useState(0);
  const [errors, setErrors] = useState(0);

  const inputRef = useRef('');
  const requestRef = useRef<number>(0);
  const lastSpawnTime = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const startTimeRef = useRef<number | null>(null);
  const speedMultiplierRef = useRef<number>(1);
  const isGameOverRef = useRef<boolean>(false);
  
  // To avoid unmounted state updates
  const isMounted = useRef(true);
  useEffect(() => {
    return () => { isMounted.current = false; };
  }, []);

  const gameLoop = useCallback((time: number) => {
    if (isGameOverRef.current || !interest) return;
    
    if (!lastTimeRef.current) lastTimeRef.current = time;
    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    if (!startTimeRef.current) startTimeRef.current = Date.now();
    const elapsedSeconds = Math.floor((Date.now() - startTimeRef.current) / 1000);
    setDifficultyTime(elapsedSeconds);

    speedMultiplierRef.current = 1 + Math.floor(elapsedSeconds / 30) * 0.5;
    const spawnRate = Math.max(1500 - (Math.floor(elapsedSeconds / 30) * 200), 500);

    setZombies(prevZombies => {
      let lostLife = false;
      let targetDied = false;

      const movedZombies = prevZombies.map(z => ({
        ...z,
        y: z.y + (z.speed * speedMultiplierRef.current * (deltaTime / 16))
      })).filter(z => {
        if (z.y > 90) { 
          lostLife = true;
          if (z.isTargeted) targetDied = true;
          return false;
        }
        return true;
      });

      if (lostLife && isMounted.current) {
        setLives(l => {
          const newLives = Math.max(0, l - 1);
          if (newLives === 0) {
            setGameOver(true);
            isGameOverRef.current = true;
          }
          return newLives;
        });
        if (targetDied) {
          inputRef.current = '';
          setInput('');
        }
      }

      if (time - lastSpawnTime.current > spawnRate && movedZombies.length < 6) {
        lastSpawnTime.current = time;
        movedZombies.push({
          id: Math.random().toString(36).substring(2, 11),
          word: getRandomWord(interest),
          x: Math.random() * 80 + 10,
          y: -10,
          speed: Math.random() * 0.12 + 0.08,
          isTargeted: false
        });
      }

      return movedZombies;
    });

    if (!isGameOverRef.current) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
  }, [interest]);

  useEffect(() => {
    if (!gameOver && interest) {
      requestRef.current = requestAnimationFrame(gameLoop);
    }
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [gameLoop, gameOver, interest]);

  const reset = useCallback(() => {
    setZombies([]);
    setLives(3);
    setScore(0);
    setGameOver(false);
    setInput('');
    inputRef.current = '';
    setWordsDefeated(0);
    setTotalCharsTyped(0);
    setErrors(0);
    startTimeRef.current = null;
    lastTimeRef.current = 0;
    lastSpawnTime.current = 0;
    isGameOverRef.current = false;
  }, []);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (isGameOverRef.current || !interest) return;
    
    const key = e.key;

    if (key === 'Escape') {
      reset();
      return;
    }

    if (key === 'Backspace') {
      inputRef.current = inputRef.current.slice(0, -1);
      setInput(inputRef.current);
      if (inputRef.current.length === 0) {
        setZombies(z => z.map(x => ({ ...x, isTargeted: false })));
      }
      return;
    }

    if (key.length > 1) return;

    const newIn = inputRef.current + key.toLowerCase();
    
    setZombies(prev => {
      let active = prev.find(z => z.isTargeted);
      
      if (!active) {
        const potential = prev.filter(z => z.word.startsWith(newIn)).sort((a,b) => b.y - a.y)[0];
        if (potential) {
          inputRef.current = newIn;
          setInput(newIn);
          setTotalCharsTyped(c => c + 1);
          return prev.map(z => z.id === potential.id ? { ...z, isTargeted: true } : z);
        } else {
          setErrors(e => e + 1);
          inputRef.current = '';
          setInput('');
          return prev;
        }
      } else {
        if (active.word.startsWith(newIn)) {
          setTotalCharsTyped(c => c + 1);
          if (active.word === newIn) {
            inputRef.current = '';
            setInput('');
            setScore(s => s + Math.floor(active!.word.length * 10 * speedMultiplierRef.current));
            setWordsDefeated(w => w + 1);
            return prev.filter(z => z.id !== active!.id);
          } else {
            inputRef.current = newIn;
            setInput(newIn);
            return prev;
          }
        } else {
          setErrors(e => e + 1);
          return prev;
        }
      }
    });
  }, [reset, interest]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  const elapsedMinutes = startTimeRef.current && gameOver 
    ? (Date.now() - startTimeRef.current) / 1000 / 60 
    : (difficultyTime / 60) || 0;
  
  const wpm = elapsedMinutes > 0 ? Math.round((totalCharsTyped / 5) / elapsedMinutes) : 0;
  const accuracy = totalCharsTyped > 0 ? Math.round(((totalCharsTyped - errors) / totalCharsTyped) * 100) : 100;

  return { zombies, lives, score, gameOver, input, difficultyTime, wordsDefeated, reset, wpm, accuracy };
}

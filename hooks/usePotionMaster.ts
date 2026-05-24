import { useState, useEffect, useCallback, useRef } from 'react';
import { getRandomWord } from '@/lib/wordBank';

export type GamePhase = 'idle' | 'playing' | 'gameover';

export interface Cauldron {
  id: string;
  word: string;
  typedSoFar: string;
  potionColor: string;
  potionName: string;
  timeLeft: number;
  maxTime: number;
  isTargeted: boolean;
  isExploding: boolean;
  isSuccess: boolean;
}

const POTIONS = [
  { name: 'Felix Felicis', color: '#FFD700', timer: 8 },
  { name: 'Polyjuice', color: '#4a7c59', timer: 6 },
  { name: 'Veritaserum', color: '#e8f4f8', timer: 4 },
  { name: 'Amortentia', color: '#ff69b4', timer: 7 },
  { name: 'Skele-Gro', color: '#8B4513', timer: 5 },
  { name: 'Mandrake', color: '#228B22', timer: 5 },
];

export function usePotionMaster() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('idle');
  const [cauldrons, setCauldrons] = useState<Cauldron[]>([]);
  const [hp, setHp] = useState(3);
  const [anger, setAnger] = useState(0);
  const [score, setScore] = useState(0);
  const [potionsBottled, setPotionsBottled] = useState(0);
  const [detentionFlash, setDetentionFlash] = useState(false);

  const stats = useRef({
    totalCharsTyped: 0,
    errors: 0,
    startTime: 0,
    timeReducer: 0,
    maxCauldrons: 3,
    lastCauldronSpawn: 0,
  });

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const nextCauldronId = useRef(1);

  const spawnCauldron = useCallback((time: number) => {
    const potionType = POTIONS[Math.floor(Math.random() * POTIONS.length)];
    // Base timer is reduced as game progresses
    const maxTime = Math.max(2, potionType.timer - stats.current.timeReducer);
    
    // Select word based on score (pseudo-difficulty)
    let lengthCategory = 'medium';
    if (score < 500) lengthCategory = 'easy';
    else if (score > 2000) lengthCategory = 'hard';
    
    let word = getRandomWord('potion-master');
    // Basic filter loop to try matching length category if possible
    for (let i = 0; i < 10; i++) {
      if (lengthCategory === 'easy' && word.length <= 5) break;
      if (lengthCategory === 'medium' && word.length > 5 && word.length <= 8) break;
      if (lengthCategory === 'hard' && word.length > 8) break;
      word = getRandomWord('potion-master');
    }

    setCauldrons(prev => {
      // Don't spawn if we've hit max
      if (prev.filter(c => !c.isExploding && !c.isSuccess).length >= stats.current.maxCauldrons) return prev;
      
      const newCauldron: Cauldron = {
        id: `c_${nextCauldronId.current++}`,
        word,
        typedSoFar: '',
        potionColor: potionType.color,
        potionName: potionType.name,
        timeLeft: maxTime,
        maxTime,
        isTargeted: false,
        isExploding: false,
        isSuccess: false,
      };
      
      stats.current.lastCauldronSpawn = time;
      return [...prev, newCauldron];
    });
  }, [score]);

  const startGame = useCallback(() => {
    setGamePhase('playing');
    setHp(3);
    setAnger(0);
    setScore(0);
    setPotionsBottled(0);
    setCauldrons([]);
    setDetentionFlash(false);
    nextCauldronId.current = 1;
    
    stats.current = {
      totalCharsTyped: 0,
      errors: 0,
      startTime: performance.now(),
      timeReducer: 0,
      maxCauldrons: 3,
      lastCauldronSpawn: performance.now()
    };
    lastTimeRef.current = performance.now();
  }, []);

  const updateGameLoop = useCallback((time: number) => {
    if (gamePhase !== 'playing') return;

    const deltaTime = (time - lastTimeRef.current) / 1000; // in seconds
    lastTimeRef.current = time;

    const timePassed = (time - stats.current.startTime) / 1000;
    
    // Difficulty scaling
    stats.current.timeReducer = Math.floor(timePassed / 30) * 0.5; // Every 30s, reduce timers by 0.5s
    if (timePassed >= 60) {
      stats.current.maxCauldrons = 4;
    }

    setCauldrons(prev => {
      let hpLost = 0;
      let angerGained = 0;
      let activeCount = 0;
      
      const nextCauldrons = prev.map(c => {
        if (c.isExploding || c.isSuccess) return c; // keep animating ones unchanged in this loop
        
        activeCount++;
        const newTime = c.timeLeft - deltaTime;
        if (newTime <= 0) {
          hpLost++;
          angerGained += 25; // Missing potion adds big anger
          return { ...c, timeLeft: 0, isExploding: true };
        }
        return { ...c, timeLeft: newTime };
      });

      if (hpLost > 0) {
        setHp(h => {
          const newHp = h - hpLost;
          if (newHp <= 0) {
            setTimeout(() => setGamePhase('gameover'), 1000);
          }
          return newHp;
        });
      }
      
      if (angerGained > 0) {
        setAnger(a => {
          const newAnger = a + angerGained;
          if (newAnger >= 100) {
            setDetentionFlash(true);
            setTimeout(() => setDetentionFlash(false), 500);
            stats.current.timeReducer += 1; // Penalty for max anger
            return 0; // reset anger
          }
          return Math.min(100, newAnger);
        });
      }

      // Cleanup finished animations
      const cleaned = nextCauldrons.filter(c => {
        if (c.isExploding || c.isSuccess) {
          // Keep them for ~1.5s for animation
          // We can just rely on a setTimeout outside or simple age tracking. 
          // For simplicity, let's just let React components handle unmount. We'll remove them here if their time is < -1.5
          return c.timeLeft > -1.5;
        }
        return true;
      }).map(c => {
        if (c.isExploding || c.isSuccess) {
           return { ...c, timeLeft: c.timeLeft - deltaTime }; // track negative time for removal
        }
        return c;
      });

      return cleaned;
    });

    // Spawn new cauldrons if needed
    setCauldrons(prev => {
      const active = prev.filter(c => !c.isExploding && !c.isSuccess).length;
      if (active < stats.current.maxCauldrons && time - stats.current.lastCauldronSpawn > 1500) {
        // Schedule a spawn outside this loop iteration to avoid double renders, but direct call is okay here for simplicity
        // We just return prev and trigger spawn in a useEffect, or do it here. 
        setTimeout(() => spawnCauldron(performance.now()), 0);
      }
      return prev;
    });

    requestRef.current = requestAnimationFrame(updateGameLoop);
  }, [gamePhase, spawnCauldron]);

  useEffect(() => {
    if (gamePhase === 'playing') {
      requestRef.current = requestAnimationFrame(updateGameLoop);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gamePhase, updateGameLoop]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gamePhase !== 'playing') return;
    if (e.key.length !== 1) return;

    const char = e.key.toLowerCase();
    
    setCauldrons(prev => {
      // 1. Check if there's already a targeted cauldron
      const target = prev.find(c => c.isTargeted && !c.isExploding && !c.isSuccess);
      
      let nextCauldrons = [...prev];
      let hit = false;
      let successCauldron: Cauldron | null = null;

      if (target) {
        const expected = target.word[target.typedSoFar.length].toLowerCase();
        if (char === expected) {
          hit = true;
          const newTyped = target.typedSoFar + char;
          nextCauldrons = nextCauldrons.map(c => 
            c.id === target.id 
              ? { ...c, typedSoFar: newTyped, isSuccess: newTyped === c.word }
              : c
          );
          if (newTyped === target.word) {
            successCauldron = nextCauldrons.find(c => c.id === target.id)!;
          }
        }
      } else {
        // Auto-target by first letter
        const match = prev.find(c => !c.isExploding && !c.isSuccess && c.word[0].toLowerCase() === char);
        if (match) {
          hit = true;
          const newTyped = char;
          nextCauldrons = nextCauldrons.map(c => 
            c.id === match.id 
              ? { ...c, typedSoFar: newTyped, isTargeted: true, isSuccess: newTyped === c.word }
              : c
          );
          if (newTyped === match.word) {
            successCauldron = nextCauldrons.find(c => c.id === match.id)!;
          }
        }
      }

      if (hit) {
        stats.current.totalCharsTyped++;
        if (successCauldron) {
          setPotionsBottled(p => p + 1);
          // Calculate score
          const isFast = successCauldron.timeLeft > (successCauldron.maxTime / 2);
          const basePoints = successCauldron.word.length * 10;
          const points = isFast ? basePoints * 2 : basePoints;
          setScore(s => s + points);
        }
      } else {
        stats.current.errors++;
        // Increase anger on error
        setAnger(a => {
          const newAnger = a + 10;
          if (newAnger >= 100) {
            setDetentionFlash(true);
            setTimeout(() => setDetentionFlash(false), 500);
            stats.current.timeReducer += 1;
            return 0;
          }
          return Math.min(100, newAnger);
        });
      }

      return nextCauldrons;
    });
  }, [gamePhase]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return {
    gamePhase,
    cauldrons,
    hp,
    anger,
    score,
    potionsBottled,
    detentionFlash,
    startGame,
    stats: stats.current
  };
}

import { useState, useEffect, useCallback, useRef } from 'react';

const DUEL_SPELLS = [
  'expelliarmus', 'stupefy', 'protego', 'accio', 'lumos',
  'nox', 'alohomora', 'riddikulus', 'expecto patronum', 'avada kedavra',
  'wingardium leviosa', 'finite incantatem', 'sectumsempra', 'impedimenta',
];

export type GamePhase = 'idle' | 'dueling' | 'roundEnd' | 'victory' | 'defeat';

export function useSpellDuel() {
  const [gamePhase, setGamePhase] = useState<GamePhase>('idle');
  const [currentSpell, setCurrentSpell] = useState('');
  const [input, setInput] = useState('');
  const [harryHP, setHarryHP] = useState(3);
  const [voldemortHP, setVoldemortHP] = useState(5);
  const [beamPosition, setBeamPosition] = useState(50);
  const [roundTimer, setRoundTimer] = useState(100); // 100%
  const [score, setScore] = useState(0);
  const [roundResult, setRoundResult] = useState<'win' | 'lose' | null>(null);

  const stats = useRef({
    totalCharsTyped: 0,
    errors: 0,
    roundStartTime: 0,
    roundDurationLimit: 5000,
    currentRound: 1,
    spells: [...DUEL_SPELLS].sort(() => Math.random() - 0.5)
  });

  const requestRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);

  const startGame = useCallback(() => {
    setHarryHP(3);
    setVoldemortHP(5);
    setScore(0);
    stats.current = {
      totalCharsTyped: 0,
      errors: 0,
      roundStartTime: 0,
      roundDurationLimit: 5000,
      currentRound: 1,
      spells: [...DUEL_SPELLS].sort(() => Math.random() - 0.5)
    };
    startRound();
  }, []);

  const startRound = useCallback(() => {
    const s = stats.current;
    if (s.spells.length === 0) {
      s.spells = [...DUEL_SPELLS].sort(() => Math.random() - 0.5);
    }
    setCurrentSpell(s.spells.shift() || 'expelliarmus');
    setInput('');
    setBeamPosition(50);
    setRoundTimer(100);
    setRoundResult(null);
    setGamePhase('dueling');
    
    s.roundDurationLimit = Math.max(2000, 5000 - (s.currentRound * 300));
    s.roundStartTime = performance.now();
    lastTimeRef.current = performance.now();
  }, []);

  const endRound = useCallback((result: 'win' | 'lose') => {
    setGamePhase('roundEnd');
    setRoundResult(result);
    
    if (result === 'win') {
      const vHP = voldemortHP - 1;
      setVoldemortHP(vHP);
      
      const timeTaken = performance.now() - stats.current.roundStartTime;
      const speedMultiplier = Math.max(1, 3 - (timeTaken / stats.current.roundDurationLimit) * 2);
      const acc = stats.current.totalCharsTyped > 0 
        ? Math.max(0, (stats.current.totalCharsTyped - stats.current.errors) / stats.current.totalCharsTyped) 
        : 1;
      
      const roundScore = Math.round(stats.current.totalCharsTyped * acc * speedMultiplier * 10);
      setScore(prev => prev + roundScore);

      if (vHP <= 0) {
        setTimeout(() => setGamePhase('victory'), 1500);
        return;
      }
    } else {
      const hHP = harryHP - 1;
      setHarryHP(hHP);
      if (hHP <= 0) {
        setTimeout(() => setGamePhase('defeat'), 1500);
        return;
      }
    }
    
    stats.current.currentRound += 1;
    setTimeout(() => {
      startRound();
    }, 2000);
  }, [harryHP, voldemortHP, startRound]);

  const updateGameLoop = useCallback((time: number) => {
    if (gamePhase !== 'dueling') return;

    const deltaTime = time - lastTimeRef.current;
    lastTimeRef.current = time;

    const timePassed = time - stats.current.roundStartTime;
    const timeLeftPercent = Math.max(0, 100 - (timePassed / stats.current.roundDurationLimit) * 100);
    
    setRoundTimer(timeLeftPercent);

    // Voldemort constantly pushes the beam left based on time
    setBeamPosition(prev => {
      const push = (deltaTime / stats.current.roundDurationLimit) * 50; // pushes 50% over the whole round
      const newPos = prev - push;
      
      if (newPos <= 0 || timeLeftPercent <= 0) {
        endRound('lose');
        return 0;
      }
      return newPos;
    });

    if (timeLeftPercent > 0 && gamePhase === 'dueling') {
      requestRef.current = requestAnimationFrame(updateGameLoop);
    }
  }, [gamePhase, endRound]);

  useEffect(() => {
    if (gamePhase === 'dueling') {
      requestRef.current = requestAnimationFrame(updateGameLoop);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gamePhase, updateGameLoop]);

  const handleKeyPress = useCallback((e: KeyboardEvent) => {
    if (gamePhase !== 'dueling') return;
    if (e.key.length !== 1) return; // ignore shift, backspace, etc.
    
    // Ignore space if it's not expected
    if (e.key === ' ' && currentSpell[input.length] !== ' ') {
      e.preventDefault();
    }

    const expectedChar = currentSpell[input.length];
    
    stats.current.totalCharsTyped += 1;

    if (e.key.toLowerCase() === expectedChar.toLowerCase()) {
      const newInput = input + expectedChar;
      setInput(newInput);
      
      setBeamPosition(prev => Math.min(100, prev + (50 / currentSpell.length) + 2)); // push right

      if (newInput === currentSpell) {
        endRound('win');
      }
    } else {
      stats.current.errors += 1;
      setBeamPosition(prev => {
        const newPos = prev - 8; // penalty push left
        if (newPos <= 0) {
          endRound('lose');
          return 0;
        }
        return newPos;
      });
    }
  }, [gamePhase, input, currentSpell, endRound]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [handleKeyPress]);

  return {
    gamePhase,
    currentSpell,
    input,
    harryHP,
    voldemortHP,
    beamPosition,
    roundTimer,
    score,
    roundResult,
    startGame,
    stats: stats.current
  };
}

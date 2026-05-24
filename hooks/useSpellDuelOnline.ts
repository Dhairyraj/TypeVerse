import { useState, useEffect, useCallback, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { getRandomWord } from '@/lib/wordBank';

export interface DuelRoom {
  id: string;
  room_code: string;
  player1_id: string;
  player2_id: string | null;
  player1_name: string;
  player2_name: string | null;
  status: 'waiting' | 'starting' | 'playing' | 'gameover';
  current_spell: string | null;
  player1_progress: number;
  player2_progress: number;
  player1_hp: number;
  player2_hp: number;
  beam_position: number;
  current_round: number;
  winner_id: string | null;
}

export function useSpellDuelOnline(userId: string | undefined, userName: string | undefined) {
  const [room, setRoom] = useState<DuelRoom | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPlayer1, setIsPlayer1] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);

  // We need refs for the latest room state and user info to use in event listeners
  const roomRef = useRef<DuelRoom | null>(null);
  roomRef.current = room;
  const isP1Ref = useRef(isPlayer1);
  isP1Ref.current = isPlayer1;

  // Sync DB to state
  const fetchRoom = useCallback(async (code: string) => {
    const { data, error } = await supabase
      .from('spell_duel_rooms')
      .select('*')
      .eq('room_code', code)
      .single();
      
    if (error) {
      setError('Room not found');
      return null;
    }
    setRoom(data as DuelRoom);
    if (data.player1_id === userId) setIsPlayer1(true);
    else setIsPlayer1(false);
    return data as DuelRoom;
  }, [userId]);

  const joinRoom = useCallback(async (code: string) => {
    if (!userId || !userName) return;
    setError(null);
    
    const data = await fetchRoom(code);
    if (!data) return;

    if (data.player1_id !== userId && data.player2_id !== userId) {
      // New player joining
      if (data.player2_id && data.player2_id !== userId) {
        setError('Room is full');
        return;
      }
      
      // I am player 2
      const response = await fetch('/api/spell-duel-room', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ roomCode: code, userId, userName })
      });
      const result = await response.json();
      
      if (result.error || !response.ok) {
        setError(result.error || 'Failed to join room');
        return;
      }
      setRoom(result.room as DuelRoom);
      setIsPlayer1(false);
    }
  }, [fetchRoom, userId, userName]);

  // Realtime Subscription
  useEffect(() => {
    if (!room?.room_code) return;

    const channel = supabase.channel(`room:${room.room_code}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'spell_duel_rooms', filter: `room_code=eq.${room.room_code}` },
        (payload) => {
          const newRoom = payload.new as DuelRoom;
          
          // Detect transition to "starting"
          if (roomRef.current?.status === 'waiting' && newRoom.status === 'starting') {
            setCountdown(3);
          }
          
          setRoom(newRoom);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [room?.room_code]);

  // Countdown effect
  useEffect(() => {
    if (room?.status === 'playing') {
      setCountdown(3);
      const interval = setInterval(() => {
        setCountdown((prev) => {
          if (prev === null || prev <= 1) {
            clearInterval(interval);
            return null;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [room?.status]);

  // Handle typing
  const handleKeyDown = useCallback(async (e: KeyboardEvent) => {
    const currentRoom = roomRef.current;
    if (!currentRoom || currentRoom.status !== 'playing' || !currentRoom.current_spell) return;
    if (e.key.length !== 1) return;

    const amIP1 = isP1Ref.current;
    const myProgress = amIP1 ? currentRoom.player1_progress : currentRoom.player2_progress;
    
    const expectedChar = currentRoom.current_spell[myProgress];
    
    if (e.key.toLowerCase() === expectedChar.toLowerCase() || 
        (e.key === ' ' && expectedChar === ' ')) {
      
      const newProgress = myProgress + 1;
      const isComplete = newProgress === currentRoom.current_spell.length;

      let updates: Partial<DuelRoom> = {};
      
      if (amIP1) {
        updates.player1_progress = newProgress;
        updates.beam_position = Math.max(0, Math.min(100, (newProgress - currentRoom.player2_progress) * 2 + 50));
      } else {
        updates.player2_progress = newProgress;
        updates.beam_position = Math.max(0, Math.min(100, (currentRoom.player1_progress - newProgress) * 2 + 50));
      }

      if (isComplete) {
        // I won this round!
        const nextSpell = getRandomWord('harry-potter');
        updates.current_spell = nextSpell;
        updates.player1_progress = 0;
        updates.player2_progress = 0;
        updates.beam_position = 50;
        updates.current_round = currentRoom.current_round + 1;
        
        if (amIP1) {
          updates.player2_hp = currentRoom.player2_hp - 1;
          if (updates.player2_hp <= 0) {
            updates.status = 'gameover';
            updates.winner_id = currentRoom.player1_id;
          }
        } else {
          updates.player1_hp = currentRoom.player1_hp - 1;
          if (updates.player1_hp <= 0) {
            updates.status = 'gameover';
            updates.winner_id = currentRoom.player2_id;
          }
        }
      }

      // Optimistic update
      setRoom({ ...currentRoom, ...updates } as DuelRoom);

      // Send to DB
      await supabase
        .from('spell_duel_rooms')
        .update(updates)
        .eq('room_code', currentRoom.room_code);
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Handle unmount/disconnect
  useEffect(() => {
    const handleBeforeUnload = () => {
      const currentRoom = roomRef.current;
      if (currentRoom && currentRoom.status === 'playing') {
        const amIP1 = isP1Ref.current;
        // If I leave, the other person wins
        supabase.from('spell_duel_rooms')
          .update({
            status: 'gameover',
            winner_id: amIP1 ? currentRoom.player2_id : currentRoom.player1_id
          })
          .eq('room_code', currentRoom.room_code)
          .then();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      handleBeforeUnload();
    };
  }, []);

  return {
    room,
    error,
    isPlayer1,
    countdown,
    joinRoom,
    fetchRoom
  };
}

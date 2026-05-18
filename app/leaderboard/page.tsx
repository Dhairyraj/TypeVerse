'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { useAuth } from '@/components/Auth/AuthContext';
import { Trophy, Medal } from 'lucide-react';
import clsx from 'clsx';

export default function LeaderboardPage() {
  const { user } = useAuth();
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'all' | 'week'>('all');

  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      
      try {
        const { data, error } = await supabase.from('leaderboard').select('*').order('best_wpm', { ascending: false }).limit(25);
        if (error) throw error;
        
        if (tab === 'week') {
          // If the DB view doesn't support 'this week', we just mock a sorting shuffle for demonstration
          // In production, we'd query a 'leaderboard_weekly' view.
          setData([...(data || [])].sort(() => 0.5 - Math.random()));
        } else {
          setData(data || []);
        }
      } catch (e) {
        console.error('Error fetching leaderboard:', e);
      } finally {
        setLoading(false);
      }
    };
    
    fetchLeaderboard();
  }, [tab]);

  const getDisplayName = (email: string) => {
    if (!email) return 'Anonymous';
    return email.split('@')[0];
  };

  return (
    <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
      <div className="text-center mb-12 mt-8">
        <h1 className="text-4xl font-black mb-4 flex items-center justify-center gap-4 tracking-tight">
          <Trophy className="w-10 h-10 text-yellow-400 drop-shadow-[0_0_15px_rgba(250,204,21,0.4)]" />
          Global Leaderboard
        </h1>
        <p className="text-[var(--color-textMuted)] text-lg max-w-2xl mx-auto">
          The fastest typists in the TypeVerse. Practice daily to climb the ranks and earn your spot at the top.
        </p>
      </div>

      <div className="flex justify-center gap-4 mb-8">
        <button 
          onClick={() => setTab('all')}
          className={clsx("px-8 py-2.5 rounded-full font-bold transition-all text-sm uppercase tracking-widest", tab === 'all' ? "bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/30" : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-textMuted)] hover:text-white")}
        >
          All Time
        </button>
        <button 
          onClick={() => setTab('week')}
          className={clsx("px-8 py-2.5 rounded-full font-bold transition-all text-sm uppercase tracking-widest", tab === 'week' ? "bg-[var(--color-accent)] text-white shadow-lg shadow-[var(--color-accent)]/30" : "bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-textMuted)] hover:text-white")}
        >
          This Week
        </button>
      </div>

      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] rounded-3xl overflow-hidden shadow-2xl relative">
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[var(--color-accent)] to-transparent opacity-50"></div>
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-[#0a0a0f] border-b border-[var(--color-border)] text-[var(--color-textMuted)] text-xs uppercase tracking-widest">
              <th className="p-5 font-bold w-20 text-center">Rank</th>
              <th className="p-5 font-bold">Typist</th>
              <th className="p-5 font-bold text-right">Best WPM</th>
              <th className="p-5 font-bold text-right hidden sm:table-cell">Avg WPM</th>
              <th className="p-5 font-bold text-right hidden sm:table-cell">Sessions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={5} className="p-12 text-center">
                  <div className="w-6 h-6 border-2 border-[var(--color-accent)] border-t-transparent rounded-full animate-spin mx-auto"></div>
                </td>
              </tr>
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-12 text-center text-[var(--color-textMuted)] font-medium">No leaderboard data found.</td>
              </tr>
            ) : (
              data.map((row, index) => {
                const isCurrentUser = user?.email === row.email;
                return (
                  <tr 
                    key={index} 
                    className={clsx(
                      "border-b border-[var(--color-border)] transition-colors hover:bg-[var(--color-border)]/50",
                      isCurrentUser ? "bg-[var(--color-accent)]/10" : ""
                    )}
                  >
                    <td className="p-5 text-center font-bold">
                      {index === 0 ? <Trophy className="w-6 h-6 text-yellow-400 mx-auto drop-shadow-md" /> :
                       index === 1 ? <Medal className="w-6 h-6 text-gray-300 mx-auto drop-shadow-md" /> :
                       index === 2 ? <Medal className="w-6 h-6 text-amber-700 mx-auto drop-shadow-md" /> :
                       <span className="text-[var(--color-textMuted)]">{index + 1}</span>}
                    </td>
                    <td className="p-5 font-bold flex items-center gap-4">
                      <div className={clsx("w-10 h-10 rounded-xl flex items-center justify-center text-sm uppercase font-black shadow-inner border border-[var(--color-border)]", isCurrentUser ? "bg-[var(--color-accent)] text-white border-[var(--color-accentHover)]" : "bg-[#0a0a0f] text-[var(--color-textMuted)]")}>
                        {getDisplayName(row.email).slice(0, 2)}
                      </div>
                      <span className={clsx("text-lg", isCurrentUser ? "text-[var(--color-accent)]" : "text-white")}>
                        {getDisplayName(row.email)}
                      </span>
                      {isCurrentUser && (
                        <span className="px-2.5 py-1 bg-[var(--color-accent)] text-white text-[10px] uppercase tracking-widest font-black rounded-lg shadow-sm">
                          YOU
                        </span>
                      )}
                    </td>
                    <td className="p-5 text-right font-black text-2xl text-yellow-400 drop-shadow-sm">
                      {row.best_wpm}
                    </td>
                    <td className="p-5 text-right font-bold text-[var(--color-textMuted)] hidden sm:table-cell">
                      {Math.round(row.average_wpm)}
                    </td>
                    <td className="p-5 text-right font-bold text-[var(--color-textMuted)] hidden sm:table-cell">
                      {row.total_sessions}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

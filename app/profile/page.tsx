'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '@/components/Auth/AuthContext';
import { supabase } from '@/lib/supabase';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Trophy, Clock, Target, Flame, Activity } from 'lucide-react';
import Link from 'next/link';

export default function ProfilePage() {
  const { user, isLoading } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [sessions, setSessions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    if (user) {
      Promise.all([
        supabase.from('user_stats').select('*').eq('user_id', user.id).single(),
        supabase.from('typing_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(90)
      ]).then(([{ data: statData }, { data: sessionData }]) => {
        setStats(statData);
        setSessions(sessionData || []);
        setLoadingData(false);
      });
    } else if (!isLoading) {
      setLoadingData(false);
    }
  }, [user, isLoading]);

  if (isLoading || loadingData) return <div className="p-8 text-center text-[var(--color-textMuted)]">Loading your stats...</div>;

  if (!user) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <h2 className="text-2xl font-bold mb-4">Sign in to view your profile</h2>
      <p className="text-[var(--color-textMuted)]">Your typing stats are waiting for you.</p>
    </div>
  );

  if (sessions.length === 0) return (
    <div className="flex-1 flex flex-col items-center justify-center p-8">
      <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-12 rounded-2xl text-center max-w-md w-full shadow-2xl">
        <Activity className="w-16 h-16 mx-auto mb-6 text-[var(--color-accent)] opacity-50" />
        <h2 className="text-2xl font-bold mb-4">No Sessions Yet</h2>
        <p className="text-[var(--color-textMuted)] mb-8">Start practicing to see your stats!</p>
        <Link href="/practice" className="bg-[var(--color-accent)] text-white px-8 py-3 rounded-xl font-bold inline-block hover:bg-[var(--color-accentHover)] transition-colors shadow-lg shadow-[var(--color-accent)]/20">
          Start Typing
        </Link>
      </div>
    </div>
  );

  const chartData = sessions.slice(0, 10).reverse().map((s, i) => ({
    name: `Session ${i+1}`,
    wpm: s.wpm
  }));
  
  if (chartData.length === 1) {
    chartData.push({...chartData[0], name: 'Current'});
  }

  const interestCounts: Record<string, number> = sessions.reduce((acc, curr) => {
    acc[curr.interest] = (acc[curr.interest] || 0) + 1;
    return acc;
  }, {});
  const favInterest = Object.keys(interestCounts).sort((a,b) => interestCounts[b] - interestCounts[a])[0] || 'None';

  const today = new Date();
  const last90Days = Array.from({length: 90}).map((_, i) => {
    const d = new Date(today);
    d.setDate(d.getDate() - (89 - i));
    return d.toISOString().split('T')[0];
  });
  
  const practiceDays = new Set(sessions.map(s => s.created_at.split('T')[0]));

  return (
    <div className="flex-1 p-8 max-w-6xl mx-auto w-full">
      <h1 className="text-3xl font-bold mb-8">Your Profile</h1>
      
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard icon={<Trophy className="text-yellow-400" />} label="Best WPM" value={stats?.best_wpm || 0} />
        <StatCard icon={<Target className="text-green-400" />} label="Average WPM" value={Math.round(stats?.average_wpm || 0)} />
        <StatCard icon={<Flame className="text-orange-400" />} label="Favorite Topic" value={<span className="capitalize">{favInterest}</span>} />
        <StatCard icon={<Clock className="text-blue-400" />} label="Total Time" value={`${Math.round(stats?.total_time_minutes || 0)}m`} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-xl">
          <h2 className="text-xl font-bold mb-6">Recent Performance (Last 10)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData} margin={{ top: 5, right: 20, bottom: 5, left: -20 }}>
                <XAxis dataKey="name" stroke="var(--color-textMuted)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="var(--color-textMuted)" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ backgroundColor: 'var(--color-surface)', borderColor: 'var(--color-border)', borderRadius: '12px', color: 'var(--color-textPrimary)' }}
                  itemStyle={{ color: 'var(--color-accent)', fontWeight: 'bold' }}
                />
                <Line type="monotone" dataKey="wpm" stroke="var(--color-accent)" strokeWidth={3} dot={{ fill: 'var(--color-surface)', strokeWidth: 2, stroke: 'var(--color-accent)', r: 5 }} activeDot={{ r: 7, fill: 'var(--color-accent)' }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-6 rounded-2xl shadow-xl flex flex-col">
          <h2 className="text-xl font-bold mb-6">Activity Heatmap (90 Days)</h2>
          <div className="flex-1 flex items-center justify-center">
            <div className="grid grid-cols-10 gap-1.5 w-full">
              {last90Days.map(day => (
                <div 
                  key={day} 
                  title={day}
                  className={`w-full aspect-square rounded-sm transition-colors ${practiceDays.has(day) ? 'bg-[var(--color-accent)] shadow-[0_0_8px_rgba(108,99,255,0.4)]' : 'bg-[var(--color-border)] hover:bg-[var(--color-border)]/80'}`} 
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: React.ReactNode, label: string, value: React.ReactNode }) {
  return (
    <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-5 rounded-2xl flex items-center gap-4 shadow-lg hover:border-[var(--color-accent)]/50 transition-colors">
      <div className="p-3 bg-[var(--color-background)] rounded-xl border border-[var(--color-border)] shadow-inner">
        {icon}
      </div>
      <div>
        <div className="text-sm text-[var(--color-textMuted)] font-medium mb-0.5">{label}</div>
        <div className="text-2xl font-bold">{value}</div>
      </div>
    </div>
  );
}

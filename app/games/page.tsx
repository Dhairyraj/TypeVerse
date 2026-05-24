import Link from 'next/link';
import { Gamepad2, Skull, ArrowRight } from 'lucide-react';

export default function GamesLobby() {
  return (
    <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
      <div className="text-center mb-16 mt-8">
        <h1 className="text-5xl font-black mb-6 flex items-center justify-center gap-4 tracking-tight">
          <Gamepad2 className="w-12 h-12 text-[var(--color-accent)]" />
          Typing Games
        </h1>
        <p className="text-[var(--color-textMuted)] text-lg max-w-2xl mx-auto leading-relaxed">
          Put your typing skills to the ultimate test. Play interactive games to improve your speed and accuracy under extreme pressure.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Zombie Game Card */}
        <Link href="/games/zombie" className="group relative bg-[#0a0a0f] border border-[var(--color-border)] hover:border-green-500/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(34,197,94,0.15)] flex flex-col cursor-pointer">
          <div className="h-56 bg-gradient-to-br from-green-900/30 to-black relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 opacity-[0.03] mix-blend-overlay" style={{backgroundImage: "url('data:image/svg+xml,%3Csvg width=\\'60\\' height=\\'60\\' viewBox=\\'0 0 60 60\\' xmlns=\\'http://www.w3.org/2000/svg\\'%3E%3Cg fill=\\'none\\' fill-rule=\\'evenodd\\'%3E%3Cg fill=\\'%23ffffff\\' fill-opacity=\\'1\\'%3E%3Cpath d=\\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E')"}}></div>
            <Skull className="w-28 h-28 text-green-500 drop-shadow-[0_0_25px_rgba(34,197,94,0.4)] group-hover:scale-110 transition-transform duration-700 ease-out" />
          </div>
          <div className="p-8 flex-1 flex flex-col border-t border-[var(--color-border)] group-hover:border-green-500/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold">Zombie Survival</h2>
              <span className="px-4 py-1.5 bg-green-500/10 text-green-400 text-xs font-black tracking-widest rounded-full border border-green-500/20 shadow-inner">NEW</span>
            </div>
            <p className="text-[var(--color-textMuted)] mb-10 flex-1 leading-relaxed text-lg">
              Words are falling from the sky. Type them correctly before they reach the bottom to survive. The difficulty continuously escalates!
            </p>
            <div className="flex items-center text-green-400 font-bold gap-2 group-hover:gap-4 transition-all uppercase tracking-widest">
              Play Now <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>
        
        {/* Spell Duel Card */}
        <Link href="/games/harry-potter" className="group relative bg-[#0a0a0f] border border-[var(--color-border)] hover:border-yellow-500/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(250,204,21,0.15)] flex flex-col cursor-pointer">
          <div className="h-56 bg-gradient-to-br from-purple-900/40 to-black relative flex items-center justify-center overflow-hidden border-b border-[var(--color-border)]">
            <div className="text-7xl font-black text-yellow-500 drop-shadow-[0_0_25px_rgba(250,204,21,0.4)] group-hover:scale-110 transition-transform duration-700 ease-out">⚡</div>
          </div>
          <div className="p-8 flex-1 flex flex-col group-hover:border-yellow-500/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold">Spell Duel</h2>
              <span className="px-4 py-1.5 bg-yellow-500/10 text-yellow-400 text-xs font-black tracking-widest rounded-full border border-yellow-500/20 shadow-inner">NEW</span>
            </div>
            <p className="text-[var(--color-textMuted)] mb-10 flex-1 leading-relaxed text-lg">
              Type spells faster than Voldemort in an epic wand duel. A fast-paced, tug-of-war typing experience.
            </p>
            <div className="flex items-center text-yellow-400 font-bold gap-2 group-hover:gap-4 transition-all uppercase tracking-widest">
              Play Now <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>
        {/* Potion Master Card */}
        <Link href="/games/potion-master" className="group relative bg-[#0a0a0f] border border-[var(--color-border)] hover:border-emerald-500/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(16,185,129,0.15)] flex flex-col cursor-pointer">
          <div className="h-56 bg-gradient-to-br from-emerald-900/40 to-black relative flex items-center justify-center overflow-hidden border-b border-[var(--color-border)]">
            <div className="text-7xl font-black text-emerald-500 drop-shadow-[0_0_25px_rgba(16,185,129,0.4)] group-hover:scale-110 transition-transform duration-700 ease-out">🧪</div>
          </div>
          <div className="p-8 flex-1 flex flex-col group-hover:border-emerald-500/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold">Potion Master</h2>
              <span className="px-4 py-1.5 bg-emerald-500/10 text-emerald-400 text-xs font-black tracking-widest rounded-full border border-emerald-500/20 shadow-inner">NEW</span>
            </div>
            <p className="text-[var(--color-textMuted)] mb-10 flex-1 leading-relaxed text-lg">
              Brew potions before they explode. A multitasking typing challenge — don't anger Snape!
            </p>
            <div className="flex items-center text-emerald-400 font-bold gap-2 group-hover:gap-4 transition-all uppercase tracking-widest">
              Play Now <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>
        {/* Spell Duel Online Card */}
        <Link href="/games/spell-duel-online" className="group relative bg-[#0a0a0f] border border-[var(--color-border)] hover:border-blue-500/50 rounded-3xl overflow-hidden transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.15)] flex flex-col cursor-pointer">
          <div className="h-56 bg-gradient-to-br from-blue-900/40 to-black relative flex items-center justify-center overflow-hidden border-b border-[var(--color-border)]">
            <div className="text-7xl font-black text-blue-500 drop-shadow-[0_0_25px_rgba(59,130,246,0.4)] group-hover:scale-110 transition-transform duration-700 ease-out">🌐</div>
          </div>
          <div className="p-8 flex-1 flex flex-col group-hover:border-blue-500/30 transition-colors">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-3xl font-bold">Spell Duel Online</h2>
              <span className="px-4 py-1.5 bg-blue-500/10 text-blue-400 text-xs font-black tracking-widest rounded-full border border-blue-500/20 shadow-inner">MULTIPLAYER</span>
            </div>
            <p className="text-[var(--color-textMuted)] mb-10 flex-1 leading-relaxed text-lg">
              Challenge a friend to a real-time wand duel. Play against real opponents across the internet!
            </p>
            <div className="flex items-center text-blue-400 font-bold gap-2 group-hover:gap-4 transition-all uppercase tracking-widest">
              Play Now <ArrowRight className="w-5 h-5" />
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}

import Link from 'next/link';
import { Keyboard, Brain, Gamepad2, ArrowRight } from 'lucide-react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'TypeVerse | AI-Powered Typing Practice & Games',
  description: 'Master your typing speed and accuracy with AI-generated content tailored to your interests, interactive 10-finger guides, and intense typing games.',
};

export default function Home() {
  return (
    <div className="flex-1 flex flex-col items-center justify-start w-full relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[var(--color-accent)] opacity-5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 opacity-5 blur-[100px] rounded-full pointer-events-none"></div>

      {/* Hero Section */}
      <section className="w-full max-w-6xl mx-auto px-6 py-24 md:py-32 flex flex-col items-center text-center relative z-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--color-surface)] border border-[var(--color-border)] text-[var(--color-textMuted)] text-sm font-semibold mb-8 animate-fade-in-up">
          <span className="w-2 h-2 rounded-full bg-[var(--color-accent)] animate-pulse"></span>
          New: Zombie Survival Mode is now live!
        </div>
        
        <h1 className="text-5xl md:text-7xl font-black text-white tracking-tight leading-tight mb-6 max-w-4xl animate-fade-in-up animation-delay-100">
          Type Faster with <br className="hidden md:block"/>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-[var(--color-accent)] to-blue-400">
            Content You Actually Care About.
          </span>
        </h1>
        
        <p className="text-lg md:text-xl text-[var(--color-textMuted)] mb-10 max-w-2xl animate-fade-in-up animation-delay-200">
          Ditch the boring lorem ipsum. TypeVerse uses AI to generate infinite typing practice 
          based on your favorite topics—from Marvel to Coding. 
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-4 animate-fade-in-up animation-delay-300">
          <Link 
            href="/practice" 
            className="group flex items-center justify-center gap-2 bg-[var(--color-accent)] hover:bg-[var(--color-accentHover)] text-white px-8 py-4 rounded-full font-bold text-lg transition-all hover:scale-105 shadow-[0_0_20px_rgba(108,99,255,0.4)] w-full sm:w-auto"
          >
            Start Typing <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link 
            href="/learn" 
            className="flex items-center justify-center gap-2 bg-[var(--color-surface)] hover:bg-[var(--color-border)] border border-[var(--color-border)] text-white px-8 py-4 rounded-full font-bold text-lg transition-all w-full sm:w-auto"
          >
            Learn 10-Finger Method
          </Link>
        </div>
      </section>

      {/* Feature Highlights */}
      <section className="w-full max-w-6xl mx-auto px-6 py-20 border-t border-[var(--color-border)] relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-3xl hover:border-[var(--color-accent)]/50 transition-colors group">
            <div className="w-14 h-14 bg-[var(--color-background)] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Brain className="w-7 h-7 text-blue-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">AI-Generated Content</h3>
            <p className="text-[var(--color-textMuted)] leading-relaxed">
              Practice with dynamic paragraphs generated on the fly. Choose from topics like Anime, History, Science, and more to keep your practice sessions highly engaging.
            </p>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-3xl hover:border-[var(--color-accent)]/50 transition-colors group">
            <div className="w-14 h-14 bg-[var(--color-background)] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Keyboard className="w-7 h-7 text-[var(--color-accent)]" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">10-Finger Guide</h3>
            <p className="text-[var(--color-textMuted)] leading-relaxed">
              Master the professional 10-finger typing technique with our interactive animated keyboard visualizer. Learn exactly which finger goes where.
            </p>
          </div>

          <div className="bg-[var(--color-surface)] border border-[var(--color-border)] p-8 rounded-3xl hover:border-green-500/50 transition-colors group">
            <div className="w-14 h-14 bg-[var(--color-background)] rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
              <Gamepad2 className="w-7 h-7 text-green-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-3">Typing Games</h3>
            <p className="text-[var(--color-textMuted)] leading-relaxed">
              Put your skills to the test under pressure. Play intense games like Zombie Survival where your WPM directly translates to your survival.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
}

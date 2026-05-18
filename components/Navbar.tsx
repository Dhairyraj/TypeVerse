'use client';
import Link from 'next/link'
import { Keyboard } from 'lucide-react'
import { useAuth } from './Auth/AuthContext';
import { UserMenu } from './Auth/UserMenu';

export function Navbar() {
  const { user, isLoading, setLoginModalOpen } = useAuth();

  return (
    <nav className="w-full border-b border-[var(--color-border)] bg-[var(--color-surface)]">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 text-xl font-bold tracking-tight">
          <Keyboard className="text-[var(--color-accent)]" />
          <span>TypeVerse</span>
        </Link>
        <div className="flex items-center gap-6 font-medium text-sm">
          <Link href="/practice" className="hover:text-[var(--color-accent)] transition-colors">Practice</Link>
          <Link href="/games" className="hover:text-[var(--color-accent)] transition-colors">Games</Link>
          <Link href="/leaderboard" className="hover:text-[var(--color-accent)] transition-colors">Leaderboard</Link>
        </div>
        <div className="flex items-center">
          {!isLoading && (
            user ? (
              <UserMenu />
            ) : (
              <button 
                onClick={() => setLoginModalOpen(true)}
                className="bg-[var(--color-accent)] hover:bg-[var(--color-accentHover)] text-white px-5 py-2 rounded-lg font-medium transition-colors text-sm cursor-pointer shadow-md"
              >
                Sign In
              </button>
            )
          )}
        </div>
      </div>
    </nav>
  )
}

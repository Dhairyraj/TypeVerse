'use client';
import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User as UserIcon, LogOut, BarChart3 } from 'lucide-react';
import Link from 'next/link';
import { useAuth } from './AuthContext';

export function UserMenu() {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  return (
    <div className="relative" ref={menuRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 rounded-full bg-[var(--color-accent)]/10 border border-[var(--color-accent)]/30 flex items-center justify-center text-[var(--color-accent)] hover:bg-[var(--color-accent)]/20 transition-colors cursor-pointer"
      >
        <UserIcon className="w-5 h-5" />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="absolute right-0 top-full mt-3 w-56 bg-[var(--color-surface)] border border-[var(--color-border)] rounded-xl shadow-2xl overflow-hidden z-50"
          >
            <div className="p-4 border-b border-[var(--color-border)] bg-[var(--color-background)]/50">
              <p className="text-xs text-[var(--color-textMuted)] uppercase tracking-wider font-semibold mb-1">Signed in as</p>
              <p className="text-sm font-medium truncate">{user.email}</p>
            </div>
            <div className="p-2">
              <Link 
                href="/profile" 
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-[var(--color-border)] transition-colors"
              >
                <BarChart3 className="w-4 h-4 text-[var(--color-accent)]" />
                <span>Profile & Stats</span>
              </Link>
              <div className="h-px bg-[var(--color-border)] my-1 mx-2" />
              <button 
                onClick={() => { signOut(); setIsOpen(false); }}
                className="flex items-center gap-3 w-full text-left px-3 py-2.5 text-sm font-medium rounded-lg hover:bg-red-500/10 text-red-400 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

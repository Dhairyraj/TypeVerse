'use client';
import { motion } from 'framer-motion';

export function SkeletonLoader() {
  return (
    <div className="w-full space-y-5">
      <motion.div 
        className="h-5 bg-[var(--color-border)] rounded w-full" 
        animate={{ opacity: [0.3, 0.7, 0.3] }} 
        transition={{ repeat: Infinity, duration: 1.5 }}
      />
      <motion.div 
        className="h-5 bg-[var(--color-border)] rounded w-[90%]" 
        animate={{ opacity: [0.3, 0.7, 0.3] }} 
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.2 }}
      />
      <motion.div 
        className="h-5 bg-[var(--color-border)] rounded w-[95%]" 
        animate={{ opacity: [0.3, 0.7, 0.3] }} 
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.4 }}
      />
      <motion.div 
        className="h-5 bg-[var(--color-border)] rounded w-[75%]" 
        animate={{ opacity: [0.3, 0.7, 0.3] }} 
        transition={{ repeat: Infinity, duration: 1.5, delay: 0.6 }}
      />
    </div>
  );
}

'use client';
import clsx from 'clsx';
import { Finger } from './keyboardData';

interface HandsProps {
  activeFinger: Finger | null;
}

export function Hands({ activeFinger }: HandsProps) {
  const getFingerClass = (finger: Finger, defaultColor: string, activeColor: string) => {
    return clsx(
      "rounded-full transition-all duration-200 shadow-md",
      activeFinger === finger ? activeColor : defaultColor
    );
  };

  return (
    <div className="flex justify-center gap-32 mt-8">
      {/* Left Hand */}
      <div className="relative flex items-end gap-[8px] h-32 w-[104px]">
        <div className={clsx("w-5 h-16 mb-16", getFingerClass('l-pinky', 'bg-slate-700', 'bg-pink-500'))} />
        <div className={clsx("w-5 h-20 mb-16", getFingerClass('l-ring', 'bg-slate-700', 'bg-orange-500'))} />
        <div className={clsx("w-5 h-24 mb-16", getFingerClass('l-middle', 'bg-slate-700', 'bg-yellow-500'))} />
        <div className={clsx("w-5 h-20 mb-16", getFingerClass('l-index', 'bg-slate-700', 'bg-green-500'))} />
        
        {/* Left Palm */}
        <div className="absolute bottom-0 left-0 w-[104px] h-20 bg-slate-800 rounded-2xl z-10" />
        
        {/* Left Thumb */}
        <div className={clsx("absolute bottom-6 -right-10 w-16 h-6 rotate-45 origin-bottom-left z-0", getFingerClass('l-thumb', 'bg-slate-700', 'bg-slate-400'))} />
      </div>

      {/* Right Hand */}
      <div className="relative flex items-end gap-[8px] h-32 w-[104px] flex-row-reverse">
        <div className={clsx("w-5 h-16 mb-16", getFingerClass('r-pinky', 'bg-slate-700', 'bg-purple-500'))} />
        <div className={clsx("w-5 h-20 mb-16", getFingerClass('r-ring', 'bg-slate-700', 'bg-indigo-500'))} />
        <div className={clsx("w-5 h-24 mb-16", getFingerClass('r-middle', 'bg-slate-700', 'bg-blue-500'))} />
        <div className={clsx("w-5 h-20 mb-16", getFingerClass('r-index', 'bg-slate-700', 'bg-teal-500'))} />
        
        {/* Right Palm */}
        <div className="absolute bottom-0 right-0 w-[104px] h-20 bg-slate-800 rounded-2xl z-10" />
        
        {/* Right Thumb */}
        <div className={clsx("absolute bottom-6 -left-10 w-16 h-6 -rotate-45 origin-bottom-right z-0", getFingerClass('r-thumb', 'bg-slate-700', 'bg-slate-400'))} />
      </div>
    </div>
  );
}

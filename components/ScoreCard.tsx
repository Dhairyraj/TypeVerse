'use client';
import { useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Share2, Copy, Check, Keyboard as KeyboardIcon } from 'lucide-react';
import html2canvas from 'html2canvas';

interface ScoreCardProps {
  isOpen: boolean;
  onClose: () => void;
  wpm: number;
  accuracy: number;
  interest: string;
}

export function ScoreCard({ isOpen, onClose, wpm, accuracy, interest }: ScoreCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const [isExporting, setIsExporting] = useState(false);

  const tweetText = `I just typed ${wpm} WPM on TypeVerse! Can you beat me? 🔥 typeverse.app`;
  const tweetUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(tweetText)}`;

  const handleCopyImage = async () => {
    if (!cardRef.current) return;
    try {
      setIsExporting(true);
      await new Promise(r => setTimeout(r, 100)); // wait for renders
      const canvas = await html2canvas(cardRef.current, {
        backgroundColor: '#0a0a0f',
        scale: 2,
      });
      canvas.toBlob(async (blob) => {
        if (blob) {
          try {
            await navigator.clipboard.write([
              new ClipboardItem({
                [blob.type]: blob
              })
            ]);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
          } catch (err) {
            console.error("Clipboard write failed:", err);
            const url = URL.createObjectURL(blob);
            window.open(url, '_blank');
          }
        }
      });
    } catch (e) {
      console.error("Error generating image", e);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#000000]/80 backdrop-blur-sm z-40"
          />
          <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="w-full max-w-sm pointer-events-auto relative"
            >
              <button 
                onClick={onClose}
                className="absolute -top-12 right-0 text-[var(--color-textMuted)] hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>

              <div 
                ref={cardRef}
                className="bg-[#12121a] border border-[#1e1e2e] rounded-3xl p-8 shadow-2xl relative overflow-hidden"
              >
                <div className="absolute -top-20 -right-20 w-48 h-48 bg-[var(--color-accent)] opacity-10 rounded-full blur-3xl"></div>
                <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-green-500 opacity-5 rounded-full blur-3xl"></div>

                <div className="text-center mb-6 relative z-10">
                  <span className="inline-block px-3 py-1 bg-[var(--color-background)] border border-[var(--color-border)] rounded-full text-xs font-bold text-[var(--color-textMuted)] uppercase tracking-widest mb-4">
                    {interest} Mode
                  </span>
                  <div className="text-7xl font-black text-white drop-shadow-[0_0_20px_rgba(108,99,255,0.4)] mb-2">
                    {wpm}
                  </div>
                  <div className="text-sm text-[var(--color-accent)] font-black uppercase tracking-widest">
                    Words Per Minute
                  </div>
                </div>

                <div className="flex justify-center gap-8 mb-8 relative z-10 border-t border-b border-[var(--color-border)] py-4">
                  <div className="text-center">
                    <div className="text-3xl font-black text-white drop-shadow-sm">{accuracy}%</div>
                    <div className="text-xs text-[var(--color-textMuted)] font-bold uppercase tracking-widest mt-1">Accuracy</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 text-gray-500 relative z-10">
                  <KeyboardIcon className="w-5 h-5 text-[var(--color-accent)]" />
                  <span className="font-black text-sm tracking-tight text-white uppercase">TypeVerse</span>
                  <span className="text-xs font-bold opacity-70">typeverse.app</span>
                </div>
              </div>

              <div className="flex gap-3 mt-6">
                <a 
                  href={tweetUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex-1 bg-[#1DA1F2] hover:bg-[#1a91da] text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-colors cursor-pointer shadow-lg"
                >
                  <Share2 className="w-5 h-5" /> Tweet
                </a>
                <button 
                  onClick={handleCopyImage}
                  disabled={isExporting}
                  className="flex-1 bg-[var(--color-surface)] border border-[var(--color-border)] hover:bg-[var(--color-border)] text-white font-bold py-3.5 rounded-xl flex justify-center items-center gap-2 transition-colors cursor-pointer shadow-lg disabled:opacity-50"
                >
                  {copied ? <Check className="w-5 h-5 text-green-500" /> : <Copy className="w-5 h-5" />}
                  {copied ? 'Copied!' : 'Copy Image'}
                </button>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}

import Link from 'next/link';
import { Metadata } from 'next';
import { blogArticles } from './data';
import { ArrowRight, BookOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Blog | TypeVerse',
  description: 'Read the latest tips, tricks, and guides on how to improve your typing speed and accuracy.',
};

export default function BlogIndex() {
  return (
    <div className="flex-1 p-8 max-w-5xl mx-auto w-full">
      <div className="text-center mb-16 mt-8">
        <h1 className="text-4xl md:text-5xl font-black mb-6 flex items-center justify-center gap-4 tracking-tight">
          <BookOpen className="w-10 h-10 text-[var(--color-accent)]" />
          Typing Mastery Blog
        </h1>
        <p className="text-[var(--color-textMuted)] text-lg max-w-2xl mx-auto leading-relaxed">
          Unlock your full potential with our in-depth guides on ergonomics, the 10-finger method, and competitive typing strategies.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogArticles.map(article => (
          <Link href={`/blog/${article.slug}`} key={article.slug} className="bg-[var(--color-surface)] border border-[var(--color-border)] hover:border-[var(--color-accent)]/50 rounded-3xl overflow-hidden flex flex-col group transition-all hover:shadow-xl hover:-translate-y-1">
            <div className="p-8 flex-1 flex flex-col">
              <div className="text-sm font-bold text-[var(--color-accent)] mb-4 uppercase tracking-widest">{new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</div>
              <h2 className="text-2xl font-bold mb-4 text-white group-hover:text-[var(--color-accent)] transition-colors line-clamp-2 leading-snug">{article.title}</h2>
              <p className="text-[var(--color-textMuted)] mb-8 flex-1 line-clamp-3 leading-relaxed">
                {article.excerpt}
              </p>
              <div className="flex items-center text-white font-bold gap-2 group-hover:gap-4 transition-all">
                Read Article <ArrowRight className="w-5 h-5 text-[var(--color-accent)]" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

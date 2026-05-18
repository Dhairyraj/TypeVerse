import { Metadata } from 'next';
import { blogArticles } from '../data';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = blogArticles.find(a => a.slug === slug);
  
  if (!article) {
    return { title: 'Article Not Found | TypeVerse' };
  }

  return {
    title: `${article.title} | TypeVerse Blog`,
    description: article.excerpt,
  };
}

export async function generateStaticParams() {
  return blogArticles.map((article) => ({
    slug: article.slug,
  }));
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const article = blogArticles.find(a => a.slug === slug);

  if (!article) {
    notFound();
  }

  return (
    <article className="flex-1 p-8 max-w-3xl mx-auto w-full pb-24">
      <Link href="/blog" className="inline-flex items-center gap-2 text-[var(--color-textMuted)] hover:text-white transition-colors mb-12 font-medium">
        <ArrowLeft className="w-4 h-4" /> Back to Blog
      </Link>
      
      <header className="mb-12">
        <div className="text-[var(--color-accent)] font-bold uppercase tracking-widest mb-4">
          {new Date(article.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
        </div>
        <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-6 tracking-tight">
          {article.title}
        </h1>
        <p className="text-xl text-[var(--color-textMuted)] leading-relaxed border-l-4 border-[var(--color-accent)] pl-6 py-2">
          {article.excerpt}
        </p>
      </header>

      <div className="prose prose-invert prose-lg max-w-none prose-headings:font-bold prose-a:text-[var(--color-accent)] prose-a:no-underline hover:prose-a:underline prose-strong:text-white">
        <ReactMarkdown>{article.content}</ReactMarkdown>
      </div>

      <div className="mt-20 pt-8 border-t border-[var(--color-border)] flex justify-between items-center">
        <div className="font-bold text-white">Share this article</div>
        <div className="flex gap-4">
          <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(article.title)}&url=https://typeverse.app/blog/${article.slug}`} target="_blank" rel="noreferrer" className="text-[var(--color-textMuted)] hover:text-[#1DA1F2] transition-colors">
            Twitter
          </a>
        </div>
      </div>
    </article>
  );
}

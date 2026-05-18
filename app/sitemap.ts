import { MetadataRoute } from 'next';
import { blogArticles } from './blog/data';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://typeverse.app';

  const staticRoutes = [
    '',
    '/practice',
    '/learn',
    '/games',
    '/games/zombie',
    '/leaderboard',
    '/blog',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: route === '' ? 1 : 0.8,
  }));

  const dynamicBlogRoutes = blogArticles.map((article) => ({
    url: `${baseUrl}/blog/${article.slug}`,
    lastModified: new Date(article.date),
    changeFrequency: 'monthly' as const,
    priority: 0.6,
  }));

  return [...staticRoutes, ...dynamicBlogRoutes];
}

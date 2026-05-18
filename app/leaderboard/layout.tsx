import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Leaderboard | TypeVerse',
  description: 'Check out the fastest typists on TypeVerse. Compete to get the highest WPM and claim your spot on the global leaderboard.',
};

export default function LeaderboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

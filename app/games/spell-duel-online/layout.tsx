import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spell Duel Online | TypeVerse Games',
  description: 'Challenge a friend to a real-time multiplayer typing duel',
};

export default function SpellDuelOnlineLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

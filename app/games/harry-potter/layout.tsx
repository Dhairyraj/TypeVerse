import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Spell Duel | TypeVerse Games',
  description: 'Type spells faster than Voldemort in an epic wand duel. A fast-paced typing game.',
};

export default function SpellDuelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

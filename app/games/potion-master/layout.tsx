import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Potion Master | TypeVerse Games',
  description: 'Brew potions before they explode — don\'t anger Snape',
};

export default function PotionMasterLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

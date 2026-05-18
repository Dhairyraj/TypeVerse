import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Zombie Survival | TypeVerse Games',
  description: 'Survive the zombie horde by typing the words before they reach the bottom of the screen. Escalate your typing speed!',
};

export default function ZombieGameLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

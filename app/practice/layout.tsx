import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Practice | TypeVerse',
  description: 'Select your typing mode, interest topic, and difficulty to generate custom AI typing practice.',
};

export default function PracticeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Learn 10-Finger Typing | TypeVerse',
  description: 'Master the 10-finger typing technique with our interactive keyboard guide and step-by-step tutorials.',
};

export default function LearnLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

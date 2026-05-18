import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Games | TypeVerse',
  description: 'Put your typing skills to the ultimate test with interactive typing games.',
};

export default function GamesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

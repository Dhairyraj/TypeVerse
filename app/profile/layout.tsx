import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Your Profile | TypeVerse',
  description: 'View your typing statistics, WPM progress, and recent practice sessions on TypeVerse.',
};

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

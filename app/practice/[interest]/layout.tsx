import { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ interest: string }> }): Promise<Metadata> {
  const { interest } = await params;
  const topic = interest.charAt(0).toUpperCase() + interest.slice(1);
  return {
    title: `${topic} Typing Practice | TypeVerse`,
    description: `Practice typing with ${topic}-themed paragraphs. Track your WPM, improve accuracy, and compete on the leaderboard.`,
  };
}

export default function InterestLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}

import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'TypeVerse | AI-Powered Typing Practice';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#0a0a0f',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 120,
            fontWeight: 'bolder',
            color: 'white',
            letterSpacing: '-0.05em',
            display: 'flex',
            alignItems: 'center',
            marginBottom: '40px',
          }}
        >
          <span style={{ color: '#6c63ff', marginRight: '20px' }}>&gt;</span>
          TypeVerse
        </div>
        <div
          style={{
            fontSize: 48,
            fontWeight: 'normal',
            color: '#64748b',
            letterSpacing: '-0.02em',
          }}
        >
          AI-Powered Typing Practice
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}

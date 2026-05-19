import { NextResponse } from 'next/server';
import { generateWithAI } from '@/lib/openrouter';

export const runtime = 'edge';

export async function POST(req: Request) {
  try {
    const { interest, difficulty, mode } = await req.json();

    if (!interest || !mode) {
      return NextResponse.json({ error: 'Missing interest or mode' }, { status: 400 });
    }

    let prompt = '';

    if (mode === 'letters') {
      prompt = `Generate a typing practice sequence for beginners learning ${interest}-themed content.
Return ONLY 30-40 characters using simple letters and spaces. No punctuation. No numbers.
Focus on home row keys: a s d f g h j k l
Example output: fall adds flask glad halls
Return ONLY the sequence, nothing else.`;
    } else if (mode === 'words') {
      const diffLabel = difficulty || 'medium';
      const wordLen = diffLabel === 'easy' ? '3-5 letter words' : diffLabel === 'medium' ? '5-8 letter words' : '8+ letter words';
      prompt = `Generate a list of 15-20 ${interest}-related words for typing practice.
Difficulty: ${wordLen}.
Separate words with a single space. No punctuation. No numbers.
Return ONLY the word list, nothing else.`;
    } else {
      // paragraph
      const lengthMap = {
        easy: '150 chars',
        medium: '250 chars',
        hard: '400 chars'
      };
      const targetLength = lengthMap[(difficulty as keyof typeof lengthMap)] || '250 chars';
      prompt = `Generate a typing practice paragraph about ${interest}.
Rules:
- Difficulty: ~${targetLength}
- Use real facts, character names, events related to ${interest}
- No quotes, no dialogue, no markdown
- Varied sentence structure for good typing rhythm
- Avoid uncommon punctuation (em dashes, semicolons)
- Return ONLY the paragraph, nothing else`;
    }

    const content = await generateWithAI(prompt);
    
    // Clean up response in case model includes quotes or markdown block
    let paragraph = content.trim();
    paragraph = paragraph.replace(/^```[\s\S]*?\n/, '').replace(/```$/, '').trim();
    paragraph = paragraph.replace(/^"|"$/g, '').trim();

    return NextResponse.json({ paragraph });
  } catch (error: any) {
    console.error('OpenRouter API Error:', error);
    return NextResponse.json({ error: error.message || 'Failed to generate paragraph' }, { status: 500 });
  }
}

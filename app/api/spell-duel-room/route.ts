import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We must use service role key here to bypass RLS if we're creating the room dynamically
// OR if RLS allows authenticated users to insert, we can just use the regular anon key 
// provided we pass the user's access token.
// Since the prompt specifies RLS: "Authenticated users can insert rooms", we can use the 
// standard client from the user's session if called from the client, BUT the prompt asks for an API route.
// In an API route without easy session propagation (unless using Supabase Auth helpers), 
// it's easier to just generate a room code and let the client insert it directly.
// Let's implement the API route to just securely create the room.

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!; // We use anon key but expect client to provide auth header if needed

export const runtime = 'edge';

function generateRoomCode() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

export async function POST(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { userId, userName } = await request.json();

    if (!userId || !userName) {
      return NextResponse.json({ error: 'Missing userId or userName' }, { status: 400 });
    }

    // Initialize supabase with the user's auth token
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: {
        headers: {
          Authorization: authHeader,
        },
      },
    });

    let roomCode = generateRoomCode();
    let isUnique = false;

    // Ensure uniqueness (simple retry loop)
    for (let i = 0; i < 5; i++) {
      const { data, error } = await supabase
        .from('spell_duel_rooms')
        .select('id')
        .eq('room_code', roomCode)
        .single();
      
      if (error && error.code === 'PGRST116') {
        // Not found, so it's unique
        isUnique = true;
        break;
      }
      roomCode = generateRoomCode();
    }

    if (!isUnique) {
      return NextResponse.json({ error: 'Failed to generate unique room code' }, { status: 500 });
    }

    const { data: newRoom, error: insertError } = await supabase
      .from('spell_duel_rooms')
      .insert({
        room_code: roomCode,
        player1_id: userId,
        player1_name: userName,
        status: 'waiting'
      })
      .select()
      .single();

    if (insertError) {
      console.error('Room creation error:', insertError);
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json({ roomCode: newRoom.room_code });
  } catch (err: any) {
    console.error('API Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

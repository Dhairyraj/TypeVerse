import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId, userName } = await req.json()

    if (!userId) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    // Use service role key to bypass RLS
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const roomCode = Math.random().toString(36).substring(2, 8).toUpperCase()

    const { data, error } = await supabase
      .from('spell_duel_rooms')
      .insert({
        room_code: roomCode,
        player1_id: userId,
        player1_name: userName,
        status: 'waiting',
        current_spell: 'expelliarmus',
      })
      .select()
      .single()

    if (error) throw error

    return NextResponse.json({ roomCode: data.room_code })
  } catch (e) {
    console.error('Room creation error:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : 'Unknown error' },
      { status: 500 }
    )
  }
}

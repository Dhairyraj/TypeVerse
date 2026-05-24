import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId, userName } = await req.json()
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
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
  } catch (error) {
    console.error('Room creation error:', error)
    return NextResponse.json({ error: String(error) }, { status: 500 })
  }
}

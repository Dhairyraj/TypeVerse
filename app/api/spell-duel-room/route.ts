import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
  try {
    const { userId, userName } = await req.json()
    console.log('Room creation request:', { userId, userName })
    console.log('Supabase URL exists:', !!process.env.NEXT_PUBLIC_SUPABASE_URL)
    console.log('Service key exists:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)

    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )

    const roomCode = Math.random().toString(36).substring(2,8).toUpperCase()
    console.log('Generated room code:', roomCode)

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

    console.log('Insert result:', { data, error })

    if (error) throw error
    return NextResponse.json({ roomCode: data.room_code })
  } catch (e) {
    console.error('FULL ERROR:', e)
    return NextResponse.json(
      { error: e instanceof Error ? e.message : JSON.stringify(e) },
      { status: 500 }
    )
  }
}

export async function PATCH(req: Request) {
  try {
    const { roomCode, userId, userName } = await req.json()
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    )
    const { data, error } = await supabase
      .from('spell_duel_rooms')
      .update({
        player2_id: userId,
        player2_name: userName,
        status: 'playing',
        current_spell: 'expelliarmus',
      })
      .eq('room_code', roomCode)
      .eq('status', 'waiting')
      .select()
      .single()
      
    if (error) throw error
    return NextResponse.json({ success: true, room: data })
  } catch (e) {
    return NextResponse.json({ error: String(e) }, { status: 500 })
  }
}

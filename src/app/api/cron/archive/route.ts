import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'

// Called at 23:59:59 via a cron job (Vercel Cron or external scheduler)
// Marks all todos from yesterday as archived
export async function POST(req: NextRequest) {
  const secret = req.headers.get('x-cron-secret')
  if (secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }

  const yesterday = new Date()
  yesterday.setDate(yesterday.getDate() - 1)
  const date = yesterday.toISOString().split('T')[0]

  const { error } = await supabaseAdmin
    .from('todos')
    .update({ archived_at: new Date().toISOString() })
    .eq('date', date)
    .is('archived_at', null)

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  return NextResponse.json({ success: true, archived_date: date })
}

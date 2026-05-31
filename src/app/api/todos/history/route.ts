import { NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET() {
  const { userId } = await auth()
  if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  // Get all distinct dates with todo counts
  const { data, error } = await supabaseAdmin
    .from('todos')
    .select('date, done')
    .eq('user_id', userId)
    .order('date', { ascending: false })

  if (error) return NextResponse.json({ error: error.message }, { status: 500 })

  // Group by date
  const grouped: Record<string, { total: number; completed: number }> = {}
  for (const row of data ?? []) {
    if (!grouped[row.date]) grouped[row.date] = { total: 0, completed: 0 }
    grouped[row.date].total++
    if (row.done) grouped[row.date].completed++
  }

  const result = Object.entries(grouped)
    .map(([date, stats]) => ({ date, ...stats }))
    .sort((a, b) => b.date.localeCompare(a.date))

  return NextResponse.json(result)
}

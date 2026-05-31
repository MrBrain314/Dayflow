'use client'

import { hasReachedHalfway } from '@/lib/utils'

interface Props { total: number; completed: number }

const messages = [
  { text: "Tu es à mi-chemin, continue !", emoji: "🔥" },
  { text: "La moitié est faite, le reste suit !", emoji: "⚡" },
  { text: "Impressionnant ! Tu gardes le rythme !", emoji: "🚀" },
  { text: "Tu avances bien, ne lâche rien !", emoji: "💪" },
]

export default function EncouragementBanner({ total, completed }: Props) {
  if (!hasReachedHalfway(total, completed)) return null
  const { text, emoji } = messages[completed % messages.length]
  return (
    <div className="rounded-2xl px-4 py-3 mb-5 animate-fade-in flex items-center gap-3"
      style={{ background: 'var(--green-soft)', border: '1px solid rgba(74,124,89,0.2)' }}>
      <span className="text-xl">{emoji}</span>
      <div>
        <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{text}</p>
        <p className="text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>{completed}/{total} tâches complétées</p>
      </div>
    </div>
  )
}

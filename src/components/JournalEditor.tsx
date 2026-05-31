'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { JournalEntry, Mood } from '@/types'
import { getTodayDate } from '@/lib/utils'
import { Save, LogIn, BookOpen, Trash2, X } from 'lucide-react'

const MOODS: { value: Mood; label: string }[] = [
  { value: '🔥', label: 'En feu' },
  { value: '😊', label: 'Bien' },
  { value: '😐', label: 'Neutre' },
  { value: '😔', label: 'Bas' },
  { value: '😴', label: 'Fatigué' },
]

const MONTHS_FR = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc']
const DAYS_FR   = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']

function fmtDate(d: string) {
  const dt = new Date(d + 'T00:00:00')
  return `${DAYS_FR[dt.getDay()]} ${dt.getDate()} ${MONTHS_FR[dt.getMonth()]}`
}

export default function JournalEditor() {
  const { user, isLoaded } = useUser()
  const { isSignedIn } = useAuth()
  const router = useRouter()

  const [content, setContent] = useState('')
  const [mood, setMood] = useState<Mood | null>(null)
  const [saving, setSaving] = useState(false)
  const [entries, setEntries] = useState<JournalEntry[]>([])
  const [reading, setReading] = useState<JournalEntry | null>(null)

  const today = getTodayDate()

  const fetchEntries = useCallback(async () => {
    try {
      const res = await fetch('/api/journal/history')
      if (res.ok) setEntries(await res.json())
    } catch { /* silent */ }
  }, [])

  useEffect(() => {
    if (isLoaded && user) fetchEntries()
  }, [user, isLoaded, fetchEntries])

  async function save() {
    if (!content.trim() && !mood) return
    setSaving(true)
    try {
      const res = await fetch('/api/journal', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content, mood, date: today }),
      })
      if (res.ok) {
        const data = await res.json()
        setEntries(prev => [data, ...prev])
        setContent('')
        setMood(null)
      }
    } catch { /* silent */ }
    setSaving(false)
  }

  async function deleteEntry(id: string) {
    const res = await fetch(`/api/journal/${id}`, { method: 'DELETE' })
    if (res.ok) { setEntries(prev => prev.filter(e => e.id !== id)); if (reading?.id === id) setReading(null) }
  }

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length

  if (!isLoaded) return null

  if (!isSignedIn) return (
    <div className="flex flex-col items-center justify-center py-28 gap-6 animate-fade-in">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: 'var(--primary-soft)', border: '1px solid var(--primary-border)', boxShadow: 'var(--shadow)' }}>
        <span className="text-3xl">📔</span>
      </div>
      <div className="text-center">
        <h2 className="text-2xl font-bold" style={{ color: 'var(--text)' }}>Ton journal t&apos;attend</h2>
        <p className="text-sm mt-2" style={{ color: 'var(--text-soft)' }}>Connecte-toi pour accéder à ton espace privé.</p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => router.push('/sign-in')}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold"
          style={{ color: 'var(--text-soft)', border: '1px solid var(--border)' }}>Se connecter</button>
        <button onClick={() => router.push('/sign-up')}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
          <LogIn size={14} /> Créer un compte
        </button>
      </div>
    </div>
  )

  if (reading) return (
    <div className="animate-fade-in">
      <button onClick={() => setReading(null)}
        className="flex items-center gap-2 text-sm mb-5 transition-opacity hover:opacity-70"
        style={{ color: 'var(--primary)' }}>
        <X size={14} /> Fermer
      </button>
      <div className="rounded-2xl p-5" style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow)' }}>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold px-2.5 py-1 rounded-lg"
              style={{ background: 'var(--primary-soft)', color: 'var(--primary)', border: '1px solid var(--primary-border)' }}>
              {fmtDate(reading.date)}
            </span>
            {reading.mood && <span className="text-xl">{reading.mood}</span>}
          </div>
          <button onClick={() => deleteEntry(reading.id)}
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: 'var(--error-soft)', color: 'var(--error)' }}>
            <Trash2 size={14} />
          </button>
        </div>
        <p className="text-sm leading-7 whitespace-pre-wrap" style={{ color: 'var(--text)' }}>{reading.content}</p>
      </div>
    </div>
  )

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <p className="text-xs font-semibold mb-1" style={{ color: 'var(--primary)' }}>Espace privé</p>
        <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Ton journal</h1>
        <p className="text-sm mt-1" style={{ color: 'var(--text-soft)' }}>Écris librement - pour toi seul.</p>
      </div>

      {/* Editor */}
      <div className="rounded-2xl p-4 mb-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <div className="flex gap-2 mb-3">
          {MOODS.map(m => (
            <button key={m.value} onClick={() => setMood(mood === m.value ? null : m.value)}
              className="flex flex-col items-center gap-0.5 px-2.5 py-2 rounded-xl text-lg transition-all"
              style={{
                background: mood === m.value ? 'var(--primary-soft)' : 'var(--bg)',
                border: mood === m.value ? '1px solid var(--primary-border)' : '1px solid var(--border)',
              }}>
              {m.value}
              <span className="text-xs" style={{ color: 'var(--text-muted)', fontSize: '10px' }}>{m.label}</span>
            </button>
          ))}
        </div>
        <textarea value={content} onChange={e => setContent(e.target.value)}
          placeholder="Qu'est-ce qui occupe ton esprit aujourd'hui ?"
          rows={6}
          className="w-full rounded-xl px-4 py-3 text-sm leading-6 resize-none focus:outline-none transition-all"
          style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)', caretColor: 'var(--primary)' }}
          onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
          onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'} />
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{wordCount} mot{wordCount !== 1 ? 's' : ''}</span>
          <button onClick={save} disabled={saving || (!content.trim() && !mood)}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white disabled:opacity-40"
            style={{ background: 'var(--primary)', boxShadow: 'var(--shadow-sm)' }}>
            <Save size={13} /> {saving ? 'Enregistrement...' : 'Enregistrer'}
          </button>
        </div>
      </div>

      {/* Entries */}
      {entries.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-3">
            <BookOpen size={14} style={{ color: 'var(--primary)' }} />
            <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>Entrées</p>
            <span className="text-xs px-2 py-0.5 rounded-full font-medium"
              style={{ background: 'var(--primary-soft)', color: 'var(--primary)' }}>{entries.length}</span>
          </div>
          <div className="rounded-2xl overflow-hidden"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
            {entries.map((entry, i) => (
              <div key={entry.id}
                className="flex items-center gap-3 px-4 py-3 animate-slide-in"
                style={{ borderBottom: i < entries.length - 1 ? '1px solid var(--border)' : 'none' }}>
                <div className="shrink-0 w-10 h-10 rounded-xl flex flex-col items-center justify-center"
                  style={{ background: 'var(--primary-soft)', border: '1px solid var(--primary-border)' }}>
                  <span className="text-xs font-bold leading-none" style={{ color: 'var(--primary)' }}>
                    {MONTHS_FR[new Date(entry.date + 'T00:00:00').getMonth()]}
                  </span>
                  <span className="text-base font-bold leading-none" style={{ color: 'var(--text)' }}>
                    {new Date(entry.date + 'T00:00:00').getDate()}
                  </span>
                </div>
                {entry.mood && <span className="text-lg shrink-0">{entry.mood}</span>}
                <div className="flex-1 min-w-0">
                  <p className="text-xs mb-0.5" style={{ color: 'var(--text-soft)' }}>{fmtDate(entry.date)}</p>
                  <p className="text-sm truncate" style={{ color: 'var(--text)' }}>
                    {entry.content || 'Entrée sans texte'}
                  </p>
                </div>
                <button onClick={() => setReading(entry)}
                  className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-semibold"
                  style={{ background: 'var(--primary-soft)', color: 'var(--primary)', border: '1px solid var(--primary-border)' }}>
                  Lire
                </button>
                <button onClick={() => deleteEntry(entry.id)}
                  className="shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: 'var(--error-soft)', color: 'var(--error)' }}>
                  <Trash2 size={13} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

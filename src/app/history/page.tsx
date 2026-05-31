'use client'

import { useState, useEffect } from 'react'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'
import { getCompletionRate } from '@/lib/utils'
import { Todo, JournalEntry } from '@/types'
import { CheckCircle2, Circle, ChevronRight, BookOpen, CalendarDays } from 'lucide-react'

interface DayData { date: string; todos: Todo[]; journal: JournalEntry | null }

const DAYS_FR   = ['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam']
const MONTHS_FR = ['jan', 'fév', 'mar', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc']

function formatShort(d: string) {
  const dt = new Date(d + 'T00:00:00')
  return `${DAYS_FR[dt.getDay()]} ${dt.getDate()} ${MONTHS_FR[dt.getMonth()]}`
}
function formatFull(d: string) {
  const dt = new Date(d + 'T00:00:00')
  return `${DAYS_FR[dt.getDay()]}. ${dt.getDate()} ${MONTHS_FR[dt.getMonth()]} ${dt.getFullYear()}`
}

export default function HistoryPage() {
  const [days, setDays] = useState<{ date: string; total: number; completed: number }[]>([])
  const [selected, setSelected] = useState<string | null>(null)
  const [dayData, setDayData] = useState<DayData | null>(null)
  const [loadingDay, setLoadingDay] = useState(false)
  const [loadingList, setLoadingList] = useState(true)

  useEffect(() => {
    fetch('/api/todos/history')
      .then(r => r.ok ? r.json() : [])
      .then(data => { setDays(data); setLoadingList(false) })
      .catch(() => setLoadingList(false))
  }, [])

  async function selectDay(date: string) {
    if (selected === date) { setSelected(null); setDayData(null); return }
    setSelected(date); setLoadingDay(true)
    try {
      const [tr, jr] = await Promise.all([fetch(`/api/todos?date=${date}`), fetch(`/api/journal?date=${date}`)])
      setDayData({ date, todos: tr.ok ? await tr.json() : [], journal: jr.ok ? await jr.json() : null })
    } catch { /* silent */ }
    setLoadingDay(false)
  }

  return (
    <div className="min-h-screen flex flex-col" style={{ background: 'var(--bg)' }}>
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-5 py-10 animate-fade-in">

        <div className="mb-8">
          <p className="text-xs font-semibold mb-1" style={{ color: 'var(--primary)' }}>Archive</p>
          <h1 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Historique</h1>
          <p className="text-sm mt-1" style={{ color: 'var(--text-soft)' }}>Retrouve toutes tes journées passées.</p>
        </div>

        {loadingList ? (
          <div className="flex justify-center py-20">
            <div className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
              style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
          </div>
        ) : days.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ background: 'var(--primary-soft)', border: '1px solid var(--primary-border)', boxShadow: 'var(--shadow)' }}>
              <CalendarDays size={22} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="text-center">
              <p className="font-bold text-lg" style={{ color: 'var(--text)' }}>Aucun historique encore</p>
              <p className="text-sm mt-1" style={{ color: 'var(--text-soft)' }}>Tes journées passées apparaîtront ici.</p>
            </div>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {days.map((day, i) => {
              const rate = getCompletionRate(day.total, day.completed)
              const isOpen = selected === day.date
              const dt = new Date(day.date + 'T00:00:00')
              return (
                <div key={day.date} style={{ animationDelay: `${i * 40}ms` }} className="animate-fade-in">
                  <button onClick={() => selectDay(day.date)}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl text-left transition-all"
                    style={{
                      background: isOpen ? 'var(--primary-soft)' : 'var(--surface)',
                      border: isOpen ? '1px solid var(--primary-border)' : '1px solid var(--border)',
                      boxShadow: isOpen ? 'none' : 'var(--shadow-sm)',
                    }}>
                    {/* Date block */}
                    <div className="shrink-0 w-12 h-12 rounded-xl flex flex-col items-center justify-center"
                      style={{ background: 'var(--primary-soft)', border: '1px solid var(--primary-border)' }}>
                      <span className="text-xs font-semibold" style={{ color: 'var(--primary)' }}>
                        {MONTHS_FR[dt.getMonth()]}
                      </span>
                      <span className="text-lg font-bold leading-none" style={{ color: 'var(--text)' }}>
                        {dt.getDate()}
                      </span>
                    </div>

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{formatShort(day.date)}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-soft)' }}>
                        {day.completed}/{day.total} tâches · {rate}%
                      </p>
                      <div className="mt-2 h-1.5 rounded-full overflow-hidden" style={{ background: 'var(--border)' }}>
                        <div className="h-full rounded-full transition-all"
                          style={{
                            width: `${rate}%`,
                            background: rate === 100 ? 'var(--success)' : 'var(--primary)',
                          }} />
                      </div>
                    </div>

                    {rate === 100 && (
                      <span className="text-xs px-2 py-1 rounded-lg shrink-0 font-semibold"
                        style={{ background: 'var(--success-soft)', color: 'var(--success)' }}>
                        ✓ Complet
                      </span>
                    )}

                    <ChevronRight size={16} className="shrink-0 transition-transform"
                      style={{ color: 'var(--text-muted)', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }} />
                  </button>

                  {isOpen && (
                    <div className="mt-2 rounded-2xl p-5 animate-fade-in"
                      style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
                      {loadingDay ? (
                        <div className="flex justify-center py-4">
                          <div className="w-5 h-5 rounded-full border-2 border-t-transparent animate-spin"
                            style={{ borderColor: 'var(--border)', borderTopColor: 'var(--primary)' }} />
                        </div>
                      ) : dayData ? (
                        <>
                          <p className="text-sm font-bold mb-4" style={{ color: 'var(--text)' }}>{formatFull(dayData.date)}</p>
                          <div className="mb-5">
                            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: 'var(--text-muted)' }}>
                              Tâches
                            </p>
                            <div className="flex flex-col gap-2">
                              {dayData.todos.map(todo => (
                                <div key={todo.id} className="flex items-center gap-2.5">
                                  {todo.done
                                    ? <CheckCircle2 size={14} style={{ color: 'var(--success)' }} className="shrink-0" />
                                    : <Circle size={14} style={{ color: 'var(--text-muted)' }} className="shrink-0" />}
                                  <span className="text-sm" style={{
                                    color: todo.done ? 'var(--text-soft)' : 'var(--text)',
                                    textDecoration: todo.done ? 'line-through' : 'none',
                                  }}>{todo.title}</span>
                                </div>
                              ))}
                              {dayData.todos.length === 0 && (
                                <p className="text-sm" style={{ color: 'var(--text-muted)' }}>Aucune tâche.</p>
                              )}
                            </div>
                          </div>
                          {dayData.journal?.content && (
                            <div>
                              <p className="text-xs font-semibold uppercase tracking-widest mb-3 flex items-center gap-1.5"
                                style={{ color: 'var(--text-muted)' }}>
                                <BookOpen size={11} /> Journal {dayData.journal.mood}
                              </p>
                              <p className="text-sm leading-relaxed line-clamp-4" style={{ color: 'var(--text-soft)' }}>
                                {dayData.journal.content}
                              </p>
                            </div>
                          )}
                        </>
                      ) : null}
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )
}

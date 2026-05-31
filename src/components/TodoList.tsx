'use client'

import { useState, useEffect, useCallback } from 'react'
import { useUser, useAuth } from '@clerk/nextjs'
import { useRouter } from 'next/navigation'
import { Todo, Priority } from '@/types'
import { getTodayDate } from '@/lib/utils'
import EncouragementBanner from './EncouragementBanner'
import { Plus, Trash2, Check, LogIn, Inbox } from 'lucide-react'

const DAYS_FR   = ['Dimanche', 'Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi']
const MONTHS_FR = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre']

function getDayName() { return DAYS_FR[new Date().getDay()] }
function getDateLabel() {
  const d = new Date()
  return `${String(d.getDate()).padStart(2,'0')} ${MONTHS_FR[d.getMonth()]} ${d.getFullYear()}`
}
function getGreeting(firstName?: string | null) {
  const h = new Date().getHours()
  const name = firstName ? `, ${firstName}` : ''
  if (h < 12) return `Bonjour${name}`
  if (h < 18) return `Bon après-midi${name}`
  return `Bonsoir${name}`
}

function getSubtitle(total: number, done: number) {
  if (total === 0) return 'Commence à planifier ta journée.'
  if (done === 0) return `${total} tâche${total > 1 ? 's' : ''} à accomplir aujourd'hui. Allez, c'est parti !`
  if (done === total) return `Toutes les tâches sont terminées. Belle journée ! 🎉`
  const rate = Math.round((done / total) * 100)
  if (rate >= 75) return `Plus que ${total - done} tâche${total - done > 1 ? 's' : ''} — tu y es presque !`
  if (rate >= 50) return `Mi-chemin atteint ! Continue sur ta lancée. 💪`
  return `${done} tâche${done > 1 ? 's' : ''} faite${done > 1 ? 's' : ''} sur ${total}. Garde le rythme !`
}

type FilterType = 'all' | 'high' | 'medium' | 'low' | 'done'

const P_COLOR: Record<string, string> = { high: 'var(--error)', medium: 'var(--warning)', low: 'var(--success)' }
const P_SOFT:  Record<string, string> = { high: 'var(--error-soft)', medium: 'var(--warning-soft)', low: 'var(--success-soft)' }
const P_LABEL: Record<string, string> = { high: 'Urgente', medium: 'Moyenne', low: 'Basse' }

const EMPTY: Record<FilterType, { title: string; sub: string }> = {
  all:    { title: 'Aucune tâche en cours',       sub: 'Ajoute une nouvelle tâche ci-dessus.' },
  high:   { title: 'Aucune tâche urgente 🎉',     sub: "Rien d'urgent aujourd'hui !" },
  medium: { title: 'Aucune tâche moyenne',        sub: 'Pas de tâche de priorité moyenne.' },
  low:    { title: 'Aucune tâche basse priorité', sub: 'Pas de petites tâches pour le moment.' },
  done:   { title: 'Aucune tâche terminée',       sub: 'Commence à cocher des tâches.' },
}

export default function TodoList() {
  const { user, isLoaded } = useUser()
  const { isSignedIn } = useAuth()
  const router = useRouter()

  const [todos, setTodos] = useState<Todo[]>([])
  const [input, setInput] = useState('')
  const [priority, setPriority] = useState<Priority>('medium')
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<FilterType>('all')
  const [selected, setSelected] = useState<Set<string>>(new Set())

  const today = getTodayDate()
  const done = todos.filter(t => t.done)
  const pending = todos.filter(t => !t.done)

  const fetchTodos = useCallback(async () => {
    try {
      const res = await fetch(`/api/todos?date=${today}`)
      if (res.ok) setTodos(await res.json())
    } catch { /* silent */ }
    finally { setLoading(false) }
  }, [today])

  useEffect(() => {
    if (!isLoaded) return
    if (user) fetchTodos()
    else setLoading(false)
  }, [user, isLoaded, fetchTodos])

  const filtered = todos.filter(t => {
    if (filter === 'all') return !t.done
    if (filter === 'done') return t.done
    return t.priority === filter && !t.done
  })

  const counts = {
    all: pending.length,
    high: pending.filter(t => t.priority === 'high').length,
    medium: pending.filter(t => t.priority === 'medium').length,
    low: pending.filter(t => t.priority === 'low').length,
    done: done.length,
  }

  async function addTodo(e: React.FormEvent) {
    e.preventDefault()
    if (!input.trim()) return
    const res = await fetch('/api/todos', {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: input.trim(), priority, date: today }),
    })
    if (res.ok) { const t = await res.json(); setTodos(prev => [t, ...prev]); setInput('') }
  }

  async function toggleTodo(id: string, done: boolean) {
    const res = await fetch(`/api/todos/${id}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ done }),
    })
    if (res.ok) setTodos(prev => prev.map(t => t.id === id ? { ...t, done } : t))
  }

  async function deleteTodo(id: string) {
    const res = await fetch(`/api/todos/${id}`, { method: 'DELETE' })
    if (res.ok) { setTodos(prev => prev.filter(t => t.id !== id)); setSelected(prev => { const s = new Set(prev); s.delete(id); return s }) }
  }

  async function deleteSelected() {
    await Promise.all([...selected].map(id => fetch(`/api/todos/${id}`, { method: 'DELETE' })))
    setTodos(prev => prev.filter(t => !selected.has(t.id)))
    setSelected(new Set())
  }

  async function markSelectedDone() {
    await Promise.all([...selected].map(id =>
      fetch(`/api/todos/${id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ done: true }) })
    ))
    setTodos(prev => prev.map(t => selected.has(t.id) ? { ...t, done: true } : t))
    setSelected(new Set())
  }

  function toggleSelect(id: string) {
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })
  }

  if (!isLoaded || loading) return (
    <div className="flex justify-center py-32">
      <div className="w-7 h-7 rounded-full border-2 border-t-transparent animate-spin"
        style={{ borderColor: 'var(--primary-soft)', borderTopColor: 'var(--primary)' }} />
    </div>
  )

  if (!isSignedIn) return (
    <div className="flex flex-col items-center justify-center py-28 gap-6 animate-fade-in">
      <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl"
        style={{ background: 'var(--surface)', boxShadow: 'var(--shadow)' }}>
        ☀️
      </div>
      <div className="text-center">
        <h2 className="text-3xl font-bold" style={{ color: 'var(--text)' }}>Bienvenue sur Dayflow</h2>
        <p className="text-base mt-2" style={{ color: 'var(--text-soft)' }}>
          Connecte-toi pour commencer à planifier ta journée.
        </p>
      </div>
      <div className="flex gap-3">
        <button onClick={() => router.push('/sign-in')}
          className="px-6 py-2.5 rounded-xl text-sm font-semibold"
          style={{ color: 'var(--text)', border: '1px solid var(--border)', background: 'var(--surface)' }}>
          Se connecter
        </button>
        <button onClick={() => router.push('/sign-up')}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold text-white"
          style={{ background: 'var(--green)' }}>
          <LogIn size={14} /> Créer un compte
        </button>
      </div>
    </div>
  )

  return (
    <div className="animate-fade-in max-w-5xl mx-auto">

      {/* Hero — Vista Lab style */}
      <div className="mb-8">
        <p className="font-cursive text-2xl mb-1" style={{ color: 'var(--primary)' }}>{getDayName()}</p>
        <h1 className="text-4xl font-bold mb-1" style={{ color: 'var(--text)' }}>
          {getGreeting(user?.firstName)},{' '}
          <span style={{ color: 'var(--text-soft)', fontWeight: 400 }}>
            {todos.length === 0 ? 'commence à planifier.' : done.length === todos.length ? 'journée accomplie !' : 'continue comme ça.'}
          </span>
        </h1>
        <p className="text-base mt-1" style={{ color: 'var(--text-soft)' }}>
          {getSubtitle(todos.length, done.length)}
        </p>
      </div>

      <EncouragementBanner total={todos.length} completed={done.length} />

      {/* Add form */}
      <div className="rounded-2xl p-4 mb-6"
        style={{ background: 'var(--surface)', border: '1px solid var(--border)', boxShadow: 'var(--shadow-sm)' }}>
        <form onSubmit={addTodo} className="flex gap-2">
          <input value={input} onChange={e => setInput(e.target.value)}
            placeholder="Titre de la tâche..."
            className="flex-1 rounded-xl px-4 py-2.5 text-sm focus:outline-none transition-all"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text)' }}
            onFocus={e => e.currentTarget.style.borderColor = 'var(--primary)'}
            onBlur={e => e.currentTarget.style.borderColor = 'var(--border)'} />
          <select value={priority} onChange={e => setPriority(e.target.value as Priority)}
            className="rounded-xl px-3 py-2.5 text-sm focus:outline-none cursor-pointer"
            style={{ background: 'var(--bg)', border: '1px solid var(--border)', color: 'var(--text-soft)' }}>
            <option value="high">Urgente</option>
            <option value="medium">Moyenne</option>
            <option value="low">Basse</option>
          </select>
          <button type="submit"
            className="w-12 h-12 rounded-xl flex items-center justify-center text-white transition-all hover:opacity-90 shrink-0"
            style={{ background: 'var(--green)' }}>
            <Plus size={22} />
          </button>
        </form>
      </div>

      {/* Filters + bulk */}
      {todos.length > 0 && (
        <div className="flex items-start justify-between gap-3 mb-4 flex-wrap">
          <div className="flex flex-wrap gap-2">
            {([
              { key: 'all',    label: `Tous(${counts.all})` },
              { key: 'high',   label: `Urgente(${counts.high})` },
              { key: 'medium', label: `Moyenne(${counts.medium})` },
              { key: 'low',    label: `Basse(${counts.low})` },
              { key: 'done',   label: `Terminées(${counts.done})` },
            ] as { key: FilterType; label: string }[]).map(f => (
              <button key={f.key} onClick={() => { setFilter(f.key); setSelected(new Set()) }}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold transition-all"
                style={{
                  background: filter === f.key ? 'var(--primary)' : 'var(--surface)',
                  color: filter === f.key ? 'white' : 'var(--text-soft)',
                  border: filter === f.key ? 'none' : '1px solid var(--border)',
                  boxShadow: filter === f.key ? 'var(--shadow-sm)' : 'none',
                }}>
                {f.label}
              </button>
            ))}
          </div>
          <div className="flex gap-2">
            <button onClick={markSelectedDone} disabled={selected.size === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                color: selected.size > 0 ? 'var(--success)' : 'var(--text-muted)',
              }}>
              <Check size={12} /> Terminer ({selected.size})
            </button>
            <button onClick={deleteSelected} disabled={selected.size === 0}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold"
              style={{
                background: 'var(--surface)', border: '1px solid var(--border)',
                color: selected.size > 0 ? 'var(--error)' : 'var(--text-muted)',
              }}>
              <Trash2 size={12} /> Supprimer ({selected.size})
            </button>
          </div>
        </div>
      )}

      {/* Task list */}
      {todos.length > 0 ? (
        filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-14 gap-3 rounded-2xl"
            style={{ background: 'var(--surface)', border: '1px solid var(--border)' }}>
            <Inbox size={40} style={{ color: 'var(--text-muted)' }} strokeWidth={1.5} />
            <div className="text-center">
              <p className="text-sm font-semibold" style={{ color: 'var(--text)' }}>{EMPTY[filter].title}</p>
              <p className="text-xs mt-1" style={{ color: 'var(--text-soft)' }}>{EMPTY[filter].sub}</p>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-8">
            {filtered.map(t => (
              <div key={t.id}
                className="rounded-2xl p-4 animate-slide-in transition-all"
                style={{
                  background: t.done ? 'var(--surface-dark)' : 'var(--surface-card)',
                  border: selected.has(t.id) ? '2px solid var(--primary)' : '1px solid transparent',
                  boxShadow: 'var(--shadow-sm)',
                }}>
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => toggleSelect(t.id)}
                      className="shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center"
                      style={{
                        background: selected.has(t.id) ? 'var(--primary)' : 'transparent',
                        borderColor: selected.has(t.id) ? 'var(--primary)' : 'rgba(139,99,60,0.3)',
                      }}>
                      {selected.has(t.id) && <Check size={11} color="white" strokeWidth={3} />}
                    </button>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-lg"
                      style={{ color: P_COLOR[t.priority], background: P_SOFT[t.priority] }}>
                      {P_LABEL[t.priority]}
                    </span>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => toggleTodo(t.id, !t.done)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(74,124,89,0.15)', color: 'var(--green)' }}>
                      <Check size={13} strokeWidth={2.5} />
                    </button>
                    <button onClick={() => deleteTodo(t.id)}
                      className="w-7 h-7 rounded-lg flex items-center justify-center"
                      style={{ background: 'rgba(192,57,43,0.12)', color: 'var(--error)' }}>
                      <Trash2 size={13} />
                    </button>
                  </div>
                </div>
                <p className="text-sm font-semibold leading-snug"
                  style={{
                    color: t.done ? 'rgba(255,255,255,0.7)' : 'var(--text)',
                    textDecoration: t.done ? 'line-through' : 'none',
                  }}>
                  {t.title}
                </p>
                <p className="text-xs mt-2" style={{ color: t.done ? 'rgba(255,255,255,0.4)' : 'var(--text-soft)' }}>
                  {new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' })}
                </p>
              </div>
            ))}
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="w-20 h-20 rounded-full flex items-center justify-center text-3xl"
            style={{ background: 'var(--surface)', boxShadow: 'var(--shadow)' }}>✨</div>
          <div className="text-center">
            <p className="font-bold text-xl" style={{ color: 'var(--text)' }}>Prêt pour une nouvelle journée ?</p>
            <p className="text-sm mt-1" style={{ color: 'var(--text-soft)' }}>Ajoute ce que tu veux accomplir aujourd&apos;hui.</p>
          </div>
        </div>
      )}

      {/* Stats bar — Vista Lab style */}
      {todos.length > 0 && (
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="rounded-2xl p-5 flex flex-col gap-1"
            style={{ background: 'var(--surface-card)', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-soft)' }}>
              Tâches complétées
            </p>
            <p className="text-4xl font-bold" style={{ color: 'var(--text)' }}>
              {String(done.length).padStart(2, '0')}
            </p>
          </div>
          <div className="rounded-2xl p-5 flex flex-col gap-1"
            style={{ background: 'var(--surface-dark)', boxShadow: 'var(--shadow-sm)' }}>
            <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.5)' }}>
              Tâches en attente
            </p>
            <p className="text-4xl font-bold text-white">
              {String(pending.length).padStart(2, '0')}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

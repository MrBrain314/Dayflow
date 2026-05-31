'use client'

import { Todo } from '@/types'
import { Trash2 } from 'lucide-react'

interface Props {
  todo: Todo
  onToggle: (id: string, done: boolean) => void
  onDelete: (id: string) => void
}

const priorityDot: Record<string, string> = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#34d399',
}

export default function TodoItem({ todo, onToggle, onDelete }: Props) {
  return (
    <div
      className="group flex items-center gap-3 px-4 py-3 rounded-xl transition-all animate-slide-in"
      style={{
        background: todo.done ? 'rgba(0,0,0,0.02)' : 'white',
        border: `1.5px solid ${todo.done ? 'rgba(0,0,0,0.05)' : 'rgba(249,115,22,0.12)'}`,
        boxShadow: todo.done ? 'none' : '0 2px 12px rgba(249,115,22,0.05)',
        opacity: todo.done ? 0.6 : 1,
      }}
    >
      <button
        onClick={() => onToggle(todo.id, !todo.done)}
        className="shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all"
        style={{
          background: todo.done ? 'linear-gradient(135deg, #f97316, #f59e0b)' : 'transparent',
          borderColor: todo.done ? '#f97316' : 'rgba(0,0,0,0.15)',
        }}
      >
        {todo.done && (
          <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
            <path d="M1 3.5L3 5.5L8 1" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </button>

      <div className="shrink-0 w-1.5 h-1.5 rounded-full"
        style={{ background: priorityDot[todo.priority] ?? '#d4d4d4' }} />

      <span className="flex-1 text-sm"
        style={{ color: todo.done ? '#a8a29e' : '#1c1917', textDecoration: todo.done ? 'line-through' : 'none' }}>
        {todo.title}
      </span>

      <button
        onClick={() => onDelete(todo.id)}
        className="opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ color: '#d4c4b8' }}
        onMouseEnter={e => (e.currentTarget.style.color = '#ef4444')}
        onMouseLeave={e => (e.currentTarget.style.color = '#d4c4b8')}
      >
        <Trash2 size={13} />
      </button>
    </div>
  )
}

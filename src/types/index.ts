export type Priority = 'low' | 'medium' | 'high'

export interface Todo {
  id: string
  user_id: string
  title: string
  priority: Priority
  done: boolean
  date: string // YYYY-MM-DD
  created_at: string
  archived_at: string | null
}

export interface DailySummary {
  id: string
  user_id: string
  date: string
  total: number
  completed: number
}

export type Mood = '😊' | '😐' | '😔' | '🔥' | '😴'

export interface JournalEntry {
  id: string
  user_id: string
  content: string
  mood: Mood | null
  date: string // YYYY-MM-DD
  created_at: string
  updated_at: string
}

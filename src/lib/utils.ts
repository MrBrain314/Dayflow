export function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('fr-FR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function getCompletionRate(total: number, completed: number): number {
  if (total === 0) return 0
  return Math.round((completed / total) * 100)
}

export function hasReachedHalfway(total: number, completed: number): boolean {
  if (total === 0) return false
  return completed / total >= 0.5 && completed > 0
}

export function priorityColor(priority: string): string {
  switch (priority) {
    case 'high': return 'text-red-500'
    case 'medium': return 'text-yellow-500'
    case 'low': return 'text-green-500'
    default: return 'text-gray-400'
  }
}

export function priorityLabel(priority: string): string {
  switch (priority) {
    case 'high': return 'Haute'
    case 'medium': return 'Moyenne'
    case 'low': return 'Basse'
    default: return ''
  }
}

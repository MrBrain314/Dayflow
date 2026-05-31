'use client'

interface Props { total: number; completed: number; size?: number }

export default function ProgressRing({ total, completed, size = 80 }: Props) {
  const rate = total === 0 ? 0 : Math.round((completed / total) * 100)
  const r = (size - 12) / 2
  const circ = 2 * Math.PI * r
  const offset = circ - (rate / 100) * circ

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(139,99,60,0.15)" strokeWidth="6" />
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--primary)" strokeWidth="6"
          strokeLinecap="round" strokeDasharray={circ} strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.6s ease' }} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-lg font-bold" style={{ color: 'var(--text)' }}>{rate}%</span>
        <span className="text-xs" style={{ color: 'var(--text-muted)' }}>{completed}/{total}</span>
      </div>
    </div>
  )
}

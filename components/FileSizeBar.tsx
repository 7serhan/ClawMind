"use client"

interface FileSizeBarProps {
  current: number
  limit: number
  label: string
}

export default function FileSizeBar({ current, limit, label }: FileSizeBarProps) {
  const pct = Math.min((current / limit) * 100, 100)
  const isWarning = pct > 80
  const isDanger = pct > 95

  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <span className="text-xs text-[var(--color-text-secondary)]">{label}</span>
        <span className="text-xs text-[var(--color-text-muted)]">
          {current.toLocaleString()} / {limit.toLocaleString()} chars
        </span>
      </div>
      <div className="h-2 bg-[var(--color-bg-tertiary)] rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            isDanger
              ? "bg-[var(--color-error)]"
              : isWarning
              ? "bg-[var(--color-warning)]"
              : "bg-[var(--color-accent)]"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  )
}

"use client"

interface HealthBadgeProps {
  status: "ok" | "warn" | "error"
  label: string
  message: string
}

const statusStyles = {
  ok: {
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/30",
    dot: "bg-emerald-400",
    text: "text-emerald-300",
  },
  warn: {
    bg: "bg-amber-500/10",
    border: "border-amber-500/30",
    dot: "bg-amber-400",
    text: "text-amber-300",
  },
  error: {
    bg: "bg-red-500/10",
    border: "border-red-500/30",
    dot: "bg-red-400",
    text: "text-red-300",
  },
}

export default function HealthBadge({ status, label, message }: HealthBadgeProps) {
  const s = statusStyles[status]

  return (
    <div className={`${s.bg} border ${s.border} rounded-lg p-4`}>
      <div className="flex items-center gap-2 mb-2">
        <span className={`w-2 h-2 rounded-full ${s.dot}`} />
        <span className={`text-sm font-medium ${s.text}`}>{label}</span>
      </div>
      <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{message}</p>
    </div>
  )
}

"use client"

import { MemoryEntry, categoryLabels, categoryColors } from "@/lib/parser"

interface MemoryCardProps {
  entry: MemoryEntry
  onDelete?: (id: string) => void
}

export default function MemoryCard({ entry, onDelete }: MemoryCardProps) {
  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg p-4 hover:border-[var(--color-accent)]/30 transition-colors group">
      <div className="flex items-start justify-between gap-3">
        <p className="text-sm leading-relaxed flex-1">{entry.text}</p>
        {onDelete && (
          <button
            onClick={() => onDelete(entry.id)}
            className="opacity-0 group-hover:opacity-100 text-[var(--color-text-muted)] hover:text-[var(--color-error)] transition-all text-xs shrink-0"
            title="Delete entry"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-4 h-4">
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>
      <div className="flex items-center gap-2 mt-3">
        <span
          className={`text-xs px-2 py-0.5 rounded-full border ${categoryColors[entry.category]}`}
        >
          {categoryLabels[entry.category]}
        </span>
        <span className="text-xs text-[var(--color-text-muted)]">{entry.section}</span>
      </div>
    </div>
  )
}

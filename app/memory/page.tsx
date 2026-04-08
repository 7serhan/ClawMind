"use client"

import { useEffect, useState } from "react"
import MemoryCard from "@/components/MemoryCard"
import type { MemoryEntry, MemoryCategory } from "@/lib/parser"

const categories: { key: MemoryCategory | "all"; label: string }[] = [
  { key: "all", label: "All" },
  { key: "preferences", label: "Preferences" },
  { key: "decisions", label: "Decisions" },
  { key: "people", label: "People" },
  { key: "projects", label: "Projects" },
  { key: "rules", label: "Rules" },
  { key: "uncategorized", label: "Other" },
]

export default function MemoryPage() {
  const [entries, setEntries] = useState<MemoryEntry[]>([])
  const [filter, setFilter] = useState<MemoryCategory | "all">("all")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/memory")
      .then((r) => r.json())
      .then((data) => {
        setEntries(data.entries)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const filtered = filter === "all" ? entries : entries.filter((e) => e.category === filter)

  const counts = entries.reduce<Record<string, number>>((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + 1
    return acc
  }, {})

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-[var(--color-bg-tertiary)] rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-24 bg-[var(--color-bg-secondary)] rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Long-Term Memory</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {entries.length} entries parsed from MEMORY.md
        </p>
      </div>

      <div className="flex gap-2 mb-6 flex-wrap">
        {categories.map(({ key, label }) => {
          const count = key === "all" ? entries.length : counts[key] || 0
          return (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${
                filter === key
                  ? "bg-[var(--color-accent)]/15 border-[var(--color-accent)]/40 text-[var(--color-accent)]"
                  : "border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:border-[var(--color-text-muted)]"
              }`}
            >
              {label} ({count})
            </button>
          )
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 text-[var(--color-text-muted)]">
          <p>No entries found.</p>
        </div>
      ) : (
        <div className="grid gap-3">
          {filtered.map((entry) => (
            <MemoryCard key={entry.id} entry={entry} />
          ))}
        </div>
      )}
    </div>
  )
}

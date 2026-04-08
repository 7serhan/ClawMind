"use client"

import { useEffect, useState } from "react"

interface DreamSweep {
  date: string
  number: string
  promoted: { entry: string; score: string; before: string; after: string }[]
  reviewed: { entry: string; score: string; reason: string }[]
}

function parseDreams(content: string): DreamSweep[] {
  const sweeps: DreamSweep[] = []
  const sections = content.split(/^## /m).filter(Boolean)

  for (const section of sections) {
    const lines = section.trim().split("\n")
    const header = lines[0] || ""
    const dateMatch = header.match(/(\d{4}-\d{2}-\d{2})/)
    const numberMatch = header.match(/Sweep #(\d+)/)

    if (!dateMatch) continue

    const sweep: DreamSweep = {
      date: dateMatch[1],
      number: numberMatch?.[1] || "?",
      promoted: [],
      reviewed: [],
    }

    let mode: "none" | "promoted" | "reviewed" = "none"

    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim()
      if (line.startsWith("### Promoted")) {
        mode = "promoted"
        continue
      }
      if (line.startsWith("### Reviewed")) {
        mode = "reviewed"
        continue
      }

      if (mode === "promoted" && line.startsWith("- **Entry:**")) {
        const entryMatch = line.match(/\*\*Entry:\*\*\s*"(.+?)"\s*.*Score:\s*([\d.]+)/)
        const before = lines[i + 1]?.trim().replace(/^-\s*Before:\s*/, "") || ""
        const after = lines[i + 2]?.trim().replace(/^-\s*After:\s*/, "") || ""
        if (entryMatch) {
          sweep.promoted.push({
            entry: entryMatch[1],
            score: entryMatch[2],
            before,
            after,
          })
        }
      }

      if (mode === "reviewed" && line.startsWith("- ")) {
        const match = line.match(/^-\s*"(.+?)"\s*.*Score:\s*([\d.]+)\s*\((.+?)\)/)
        if (match) {
          sweep.reviewed.push({
            entry: match[1],
            score: match[2],
            reason: match[3],
          })
        }
      }
    }

    sweeps.push(sweep)
  }

  return sweeps
}

export default function DreamsPage() {
  const [sweeps, setSweeps] = useState<DreamSweep[]>([])
  const [exists, setExists] = useState(true)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/dreams")
      .then((r) => r.json())
      .then((data) => {
        if (data.content) {
          setSweeps(parseDreams(data.content))
        }
        setExists(data.exists)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-[var(--color-bg-tertiary)] rounded" />
        <div className="h-48 bg-[var(--color-bg-secondary)] rounded-lg" />
      </div>
    )
  }

  if (!exists) {
    return (
      <div>
        <h2 className="text-xl font-semibold mb-6">Dreams</h2>
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg p-8 text-center">
          <p className="text-[var(--color-text-secondary)] mb-2">Dreaming is not enabled.</p>
          <p className="text-sm text-[var(--color-text-muted)]">
            Enable the dreaming sweep in your OpenClaw configuration to promote daily notes to long-term memory automatically.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Dreams</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {sweeps.length} dreaming sweeps recorded
        </p>
      </div>

      <div className="space-y-6">
        {sweeps.map((sweep) => (
          <div
            key={sweep.date}
            className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg overflow-hidden"
          >
            <div className="px-4 py-3 border-b border-[var(--color-border-default)] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium">{sweep.date}</span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--color-accent)]/15 text-[var(--color-accent)]">
                  Sweep #{sweep.number}
                </span>
              </div>
              <span className="text-xs text-[var(--color-text-muted)]">
                {sweep.promoted.length} promoted, {sweep.reviewed.length} skipped
              </span>
            </div>

            {sweep.promoted.length > 0 && (
              <div className="p-4 space-y-3">
                <h4 className="text-xs font-medium text-emerald-400 uppercase tracking-wider">Promoted</h4>
                {sweep.promoted.map((p, i) => (
                  <div key={i} className="bg-emerald-500/5 border border-emerald-500/20 rounded-lg p-3">
                    <div className="flex items-start justify-between gap-2">
                      <p className="text-sm">&ldquo;{p.entry}&rdquo;</p>
                      <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 shrink-0">
                        {p.score}
                      </span>
                    </div>
                    <div className="mt-2 text-xs text-[var(--color-text-muted)] space-y-0.5">
                      <p>{p.before}</p>
                      <p>{p.after}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {sweep.reviewed.length > 0 && (
              <div className="p-4 pt-0 space-y-2">
                <h4 className="text-xs font-medium text-[var(--color-text-muted)] uppercase tracking-wider">Reviewed</h4>
                {sweep.reviewed.map((r, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]">
                    <span className="text-xs text-[var(--color-text-muted)] w-8">{r.score}</span>
                    <span>&ldquo;{r.entry}&rdquo;</span>
                    <span className="text-xs text-[var(--color-text-muted)] ml-auto">({r.reason})</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

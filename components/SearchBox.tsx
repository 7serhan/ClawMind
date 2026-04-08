"use client"

import { useState, useMemo } from "react"
import Fuse from "fuse.js"

interface SearchableFile {
  name: string
  content: string
  type: "core" | "daily"
}

interface SearchResult {
  file: string
  type: "core" | "daily"
  matches: { line: number; text: string }[]
}

interface SearchBoxProps {
  files: SearchableFile[]
}

export default function SearchBox({ files }: SearchBoxProps) {
  const [query, setQuery] = useState("")

  const indexedLines = useMemo(() => {
    return files.flatMap((f) =>
      f.content.split("\n").map((text, i) => ({
        file: f.name,
        type: f.type,
        line: i + 1,
        text,
      }))
    )
  }, [files])

  const fuse = useMemo(() => {
    return new Fuse(indexedLines, {
      keys: ["text"],
      threshold: 0.3,
      includeMatches: true,
      minMatchCharLength: 2,
    })
  }, [indexedLines])

  const results = useMemo(() => {
    if (!query || query.length < 2) return []

    const raw = fuse.search(query, { limit: 50 })

    const grouped = new Map<string, SearchResult>()
    for (const r of raw) {
      const item = r.item
      if (!grouped.has(item.file)) {
        grouped.set(item.file, { file: item.file, type: item.type, matches: [] })
      }
      grouped.get(item.file)!.matches.push({ line: item.line, text: item.text })
    }

    return Array.from(grouped.values())
  }, [query, fuse])

  return (
    <div>
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)]"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search all memory files..."
          className="w-full bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg pl-10 pr-4 py-3 text-sm text-[var(--color-text-primary)] placeholder:text-[var(--color-text-muted)] focus:outline-none focus:border-[var(--color-accent)] transition-colors"
          autoFocus
        />
      </div>

      {query.length >= 2 && (
        <div className="mt-4 space-y-4">
          {results.length === 0 ? (
            <p className="text-sm text-[var(--color-text-muted)] text-center py-8">
              No results found for &ldquo;{query}&rdquo;
            </p>
          ) : (
            results.map((group) => (
              <div
                key={group.file}
                className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg overflow-hidden"
              >
                <div className="px-4 py-2 border-b border-[var(--color-border-default)] flex items-center gap-2">
                  <span
                    className={`text-xs px-1.5 py-0.5 rounded ${
                      group.type === "core"
                        ? "bg-[var(--color-accent)]/20 text-[var(--color-accent)]"
                        : "bg-emerald-500/20 text-emerald-300"
                    }`}
                  >
                    {group.type === "core" ? "Core" : "Daily"}
                  </span>
                  <span className="text-sm font-medium">{group.file}</span>
                  <span className="text-xs text-[var(--color-text-muted)] ml-auto">
                    {group.matches.length} match{group.matches.length > 1 ? "es" : ""}
                  </span>
                </div>
                <div className="divide-y divide-[var(--color-border-default)]">
                  {group.matches.slice(0, 5).map((m, i) => (
                    <div key={i} className="px-4 py-2 flex items-start gap-3">
                      <span className="text-xs text-[var(--color-text-muted)] w-8 text-right shrink-0 pt-0.5">
                        L{m.line}
                      </span>
                      <span className="text-sm text-[var(--color-text-secondary)]">
                        {highlightMatch(m.text, query)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}

function highlightMatch(text: string, query: string) {
  if (!query) return text
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi")
  const parts = text.split(regex)

  return parts.map((part, i) =>
    regex.test(part) ? (
      <mark key={i} className="bg-[var(--color-accent)]/30 text-[var(--color-text-primary)] rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  )
}

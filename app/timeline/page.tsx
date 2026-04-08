"use client"

import { useEffect, useState } from "react"
import CalendarGrid from "@/components/CalendarGrid"

interface DailyNote {
  date: string
  content: string
  size: number
}

export default function TimelinePage() {
  const [notes, setNotes] = useState<DailyNote[]>([])
  const [selectedDate, setSelectedDate] = useState<string | null>(null)
  const [selectedContent, setSelectedContent] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/daily")
      .then((r) => r.json())
      .then((data) => {
        setNotes(data.notes)
        setLoading(false)
        if (data.notes.length > 0) {
          setSelectedDate(data.notes[0].date)
          setSelectedContent(data.notes[0].content)
        }
      })
      .catch(() => setLoading(false))
  }, [])

  function handleSelect(date: string) {
    setSelectedDate(date)
    const note = notes.find((n) => n.date === date)
    if (note) {
      setSelectedContent(note.content)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-[var(--color-bg-tertiary)] rounded" />
        <div className="h-64 bg-[var(--color-bg-secondary)] rounded-lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Daily Notes Timeline</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          {notes.length} notes across {notes.length > 0 ? `${notes[notes.length - 1].date} to ${notes[0].date}` : "no dates"}
        </p>
      </div>

      <div className="grid grid-cols-[320px_1fr] gap-6">
        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg p-4">
          <CalendarGrid notes={notes} onSelect={handleSelect} selectedDate={selectedDate} />

          <div className="mt-4 space-y-1">
            {notes.slice(0, 5).map((note) => (
              <button
                key={note.date}
                onClick={() => handleSelect(note.date)}
                className={`w-full text-left px-3 py-2 rounded-md text-sm transition-colors ${
                  selectedDate === note.date
                    ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                    : "text-[var(--color-text-secondary)] hover:bg-[var(--color-bg-hover)]"
                }`}
              >
                <span className="font-mono text-xs">{note.date}</span>
                <span className="text-xs text-[var(--color-text-muted)] ml-2">
                  {note.size} chars
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg p-4">
          {selectedDate && selectedContent ? (
            <>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-[var(--color-border-default)]">
                <h3 className="text-sm font-medium">{selectedDate}</h3>
                <span className="text-xs text-[var(--color-text-muted)]">
                  {selectedContent.length} characters
                </span>
              </div>
              <div className="prose prose-invert prose-sm max-w-none">
                {selectedContent.split("\n").map((line, i) => {
                  if (line.startsWith("# ")) {
                    return <h2 key={i} className="text-base font-semibold mt-0 mb-3">{line.replace("# ", "")}</h2>
                  }
                  if (line.startsWith("- ")) {
                    return (
                      <div key={i} className="flex gap-2 py-1">
                        <span className="text-[var(--color-accent)] shrink-0">&#x2022;</span>
                        <span className="text-sm text-[var(--color-text-secondary)]">{line.replace("- ", "")}</span>
                      </div>
                    )
                  }
                  if (line.trim() === "") return <div key={i} className="h-2" />
                  return <p key={i} className="text-sm text-[var(--color-text-secondary)] my-1">{line}</p>
                })}
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-48 text-[var(--color-text-muted)] text-sm">
              Select a date to view notes
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

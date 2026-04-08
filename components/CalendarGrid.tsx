"use client"

interface DailyNote {
  date: string
  size: number
  content: string
}

interface CalendarGridProps {
  notes: DailyNote[]
  onSelect: (date: string) => void
  selectedDate: string | null
}

function getDaysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

function getFirstDayOfWeek(year: number, month: number): number {
  return new Date(year, month, 1).getDay()
}

export default function CalendarGrid({ notes, onSelect, selectedDate }: CalendarGridProps) {
  const noteMap = new Map(notes.map((n) => [n.date, n]))
  const maxSize = Math.max(...notes.map((n) => n.size), 1)

  const today = new Date()
  const year = today.getFullYear()
  const month = today.getMonth()
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)

  const monthLabel = today.toLocaleString("en-US", { month: "long", year: "numeric" })

  const cells: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) cells.push(null)
  for (let d = 1; d <= daysInMonth; d++) cells.push(d)

  return (
    <div>
      <h3 className="text-sm font-medium text-[var(--color-text-secondary)] mb-3">{monthLabel}</h3>
      <div className="grid grid-cols-7 gap-1">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((d) => (
          <div key={d} className="text-center text-xs text-[var(--color-text-muted)] py-1">
            {d}
          </div>
        ))}
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} />
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`
          const note = noteMap.get(dateStr)
          const isToday = day === today.getDate()
          const isSelected = dateStr === selectedDate
          const intensity = note ? Math.max(0.2, note.size / maxSize) : 0

          return (
            <button
              key={dateStr}
              onClick={() => note && onSelect(dateStr)}
              className={`aspect-square rounded-md text-xs flex items-center justify-center transition-all relative ${
                isSelected
                  ? "ring-2 ring-[var(--color-accent)] bg-[var(--color-accent)]/20"
                  : note
                  ? "hover:ring-1 hover:ring-[var(--color-accent)]/50 cursor-pointer"
                  : "cursor-default"
              } ${isToday ? "font-bold" : ""}`}
              style={{
                backgroundColor: note
                  ? `rgba(124, 92, 252, ${intensity * 0.4})`
                  : "var(--color-bg-tertiary)",
              }}
              disabled={!note}
            >
              {day}
              {isToday && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[var(--color-accent)]" />
              )}
            </button>
          )
        })}
      </div>
    </div>
  )
}

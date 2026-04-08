export interface MemoryEntry {
  id: string
  text: string
  category: MemoryCategory
  section: string
}

export type MemoryCategory =
  | "preferences"
  | "decisions"
  | "people"
  | "projects"
  | "rules"
  | "uncategorized"

const categoryPatterns: { category: MemoryCategory; patterns: RegExp[] }[] = [
  {
    category: "preferences",
    patterns: [/prefer/i, /always use/i, /never use/i, /like to/i, /favorite/i],
  },
  {
    category: "decisions",
    patterns: [/decided/i, /going with/i, /chose/i, /picked/i, /switched to/i],
  },
  {
    category: "people",
    patterns: [/works at/i, /manages/i, /is the/i, /leads/i, /owns the/i],
  },
  {
    category: "projects",
    patterns: [/\/[\w-]+\/[\w-]+/i, /https?:\/\//i, /repo/i, /repository/i],
  },
  {
    category: "rules",
    patterns: [/must /i, /should /i, /never /i, /always /i, /don't /i, /do not /i],
  },
]

function categorize(text: string): MemoryCategory {
  for (const { category, patterns } of categoryPatterns) {
    for (const pattern of patterns) {
      if (pattern.test(text)) {
        return category
      }
    }
  }
  return "uncategorized"
}

function stripLeadingMarkers(text: string): string {
  return text.replace(/^[\s]*[-*>]+\s*/, "").trim()
}

export function parseMemoryFile(content: string): MemoryEntry[] {
  if (!content || !content.trim()) return []

  const entries: MemoryEntry[] = []
  let currentSection = "General"
  let idCounter = 0

  const lines = content.split("\n")

  for (const line of lines) {
    const trimmed = line.trim()

    // Section headers
    if (trimmed.startsWith("## ")) {
      currentSection = trimmed.replace(/^##\s+/, "")
      continue
    }

    // Skip top-level heading
    if (trimmed.startsWith("# ")) continue

    // Skip empty lines
    if (!trimmed) continue

    // List items or paragraphs
    const stripped = stripLeadingMarkers(trimmed)
    if (!stripped) continue

    entries.push({
      id: `entry-${idCounter++}`,
      text: stripped,
      category: categorize(stripped),
      section: currentSection,
    })
  }

  return entries
}

export const categoryLabels: Record<MemoryCategory, string> = {
  preferences: "Preference",
  decisions: "Decision",
  people: "Person",
  projects: "Project",
  rules: "Rule",
  uncategorized: "Note",
}

export const categoryColors: Record<MemoryCategory, string> = {
  preferences: "bg-violet-500/20 text-violet-300 border-violet-500/30",
  decisions: "bg-amber-500/20 text-amber-300 border-amber-500/30",
  people: "bg-sky-500/20 text-sky-300 border-sky-500/30",
  projects: "bg-emerald-500/20 text-emerald-300 border-emerald-500/30",
  rules: "bg-rose-500/20 text-rose-300 border-rose-500/30",
  uncategorized: "bg-zinc-500/20 text-zinc-300 border-zinc-500/30",
}

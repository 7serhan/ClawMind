"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

const nav = [
  { href: "/", label: "Dashboard", icon: "grid" },
  { href: "/memory", label: "Memory", icon: "brain" },
  { href: "/timeline", label: "Timeline", icon: "calendar" },
  { href: "/dreams", label: "Dreams", icon: "sparkles" },
  { href: "/search", label: "Search", icon: "search" },
  { href: "/health", label: "Health", icon: "heart" },
  { href: "/editor", label: "Editor", icon: "code" },
]

const icons: Record<string, React.ReactNode> = {
  grid: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path d="M3.75 3.75h6.5v6.5h-6.5zM13.75 3.75h6.5v6.5h-6.5zM3.75 13.75h6.5v6.5h-6.5zM13.75 13.75h6.5v6.5h-6.5z" />
    </svg>
  ),
  brain: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path d="M12 2a7 7 0 00-7 7c0 2.5 1.5 4.5 3 6v3a2 2 0 002 2h4a2 2 0 002-2v-3c1.5-1.5 3-3.5 3-6a7 7 0 00-7-7z" />
      <path d="M9 18h6M10 21h4" />
    </svg>
  ),
  calendar: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <rect x="3" y="4" width="18" height="18" rx="2" />
      <path d="M16 2v4M8 2v4M3 10h18" />
    </svg>
  ),
  sparkles: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path d="M12 2l2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5z" />
    </svg>
  ),
  search: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.35-4.35" />
    </svg>
  ),
  heart: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
    </svg>
  ),
  code: (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} className="w-5 h-5">
      <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
    </svg>
  ),
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="fixed left-0 top-0 bottom-0 w-56 bg-[var(--color-bg-secondary)] border-r border-[var(--color-border-default)] flex flex-col z-50">
      <div className="p-4 border-b border-[var(--color-border-default)]">
        <h1 className="text-lg font-semibold tracking-tight">
          <span className="text-[var(--color-accent)]">Claw</span>Mind
        </h1>
        <p className="text-xs text-[var(--color-text-muted)] mt-0.5">Memory Explorer</p>
      </div>

      <nav className="flex-1 py-2">
        {nav.map(({ href, label, icon }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg text-sm transition-colors ${
                active
                  ? "bg-[var(--color-accent)]/10 text-[var(--color-accent)]"
                  : "text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-hover)]"
              }`}
            >
              {icons[icon]}
              {label}
            </Link>
          )
        })}
      </nav>

      <div className="p-4 border-t border-[var(--color-border-default)]">
        <p className="text-xs text-[var(--color-text-muted)]">Local only. No cloud.</p>
      </div>
    </aside>
  )
}

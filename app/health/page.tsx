"use client"

import { useEffect, useState, useCallback } from "react"
import HealthBadge from "@/components/HealthBadge"

interface HealthCheck {
  id: string
  label: string
  status: "ok" | "warn" | "error"
  message: string
}

export default function HealthPage() {
  const [checks, setChecks] = useState<HealthCheck[]>([])
  const [loading, setLoading] = useState(true)
  const [lastRefresh, setLastRefresh] = useState<Date | null>(null)

  const fetchHealth = useCallback(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then((data) => {
        setChecks(data.checks)
        setLoading(false)
        setLastRefresh(new Date())
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchHealth()
    const interval = setInterval(fetchHealth, 30000)
    return () => clearInterval(interval)
  }, [fetchHealth])

  const okCount = checks.filter((c) => c.status === "ok").length
  const warnCount = checks.filter((c) => c.status === "warn").length
  const errorCount = checks.filter((c) => c.status === "error").length

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-[var(--color-bg-tertiary)] rounded" />
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-20 bg-[var(--color-bg-secondary)] rounded-lg" />
        ))}
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold">Health</h2>
          <p className="text-sm text-[var(--color-text-muted)] mt-1">
            {okCount} ok, {warnCount} warnings, {errorCount} errors
          </p>
        </div>
        <div className="flex items-center gap-3">
          {lastRefresh && (
            <span className="text-xs text-[var(--color-text-muted)]">
              Updated {lastRefresh.toLocaleTimeString()}
            </span>
          )}
          <button
            onClick={fetchHealth}
            className="text-xs px-3 py-1.5 rounded-lg border border-[var(--color-border-default)] text-[var(--color-text-secondary)] hover:border-[var(--color-accent)] hover:text-[var(--color-accent)] transition-colors"
          >
            Refresh
          </button>
        </div>
      </div>

      <div className="grid gap-3">
        {checks.map((check) => (
          <HealthBadge key={check.id} status={check.status} label={check.label} message={check.message} />
        ))}
      </div>
    </div>
  )
}

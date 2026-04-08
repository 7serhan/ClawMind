"use client"

import { useEffect, useState } from "react"
import FileSizeBar from "@/components/FileSizeBar"

interface FileInfo {
  name: string
  exists: boolean
  size: number
  modifiedAt: string | null
}

interface WorkspaceData {
  path: string
  files: FileInfo[]
  dailyNotes: {
    count: number
    oldest: string | null
    newest: string | null
  }
}

function computeDaysSpan(oldest: string | null): number {
  if (!oldest) return 0
  const now = new Date()
  const then = new Date(oldest)
  return Math.floor((now.getTime() - then.getTime()) / (1000 * 60 * 60 * 24))
}

export default function Dashboard() {
  const [data, setData] = useState<WorkspaceData | null>(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch("/api/workspace")
      .then((r) => {
        if (!r.ok) throw new Error()
        return r.json()
      })
      .then(setData)
      .catch(() => setError(true))
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Workspace Found</h2>
          <p className="text-[var(--color-text-secondary)] text-sm max-w-md">
            Set the <code className="text-[var(--color-accent)] bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 rounded text-xs">CLAWMIND_WORKSPACE</code> environment variable to your OpenClaw workspace path, or ensure <code className="text-[var(--color-accent)] bg-[var(--color-bg-tertiary)] px-1.5 py-0.5 rounded text-xs">~/.openclaw/workspace</code> exists.
          </p>
        </div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-[var(--color-bg-tertiary)] rounded" />
        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 bg-[var(--color-bg-secondary)] rounded-lg" />
          ))}
        </div>
      </div>
    )
  }

  const memoryFile = data.files.find((f) => f.name === "MEMORY.md")
  const totalSize = data.files.reduce((sum, f) => sum + f.size, 0)
  const daysSpan = computeDaysSpan(data.dailyNotes.oldest)

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1 font-mono">{data.path}</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Daily Notes" value={data.dailyNotes.count} sub={`${daysSpan} day span`} />
        <StatCard label="Core Files" value={data.files.filter((f) => f.exists).length} sub={`of ${data.files.length} expected`} />
        <StatCard
          label="Memory Size"
          value={memoryFile ? `${(memoryFile.size / 1024).toFixed(1)}K` : "N/A"}
          sub="characters"
        />
        <StatCard
          label="Latest Note"
          value={data.dailyNotes.newest || "None"}
          sub={data.dailyNotes.newest === new Date().toISOString().slice(0, 10) ? "Today" : ""}
        />
      </div>

      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg p-4 mb-6 space-y-4">
        <h3 className="text-sm font-medium text-[var(--color-text-secondary)]">Size Limits</h3>
        <FileSizeBar label="MEMORY.md" current={memoryFile?.size || 0} limit={16000} />
        <FileSizeBar label="Total Bootstrap" current={totalSize} limit={120000} />
      </div>

      <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-[var(--color-border-default)]">
              <th className="text-left px-4 py-3 text-[var(--color-text-secondary)] font-medium">File</th>
              <th className="text-left px-4 py-3 text-[var(--color-text-secondary)] font-medium">Status</th>
              <th className="text-right px-4 py-3 text-[var(--color-text-secondary)] font-medium">Size</th>
              <th className="text-right px-4 py-3 text-[var(--color-text-secondary)] font-medium">Modified</th>
            </tr>
          </thead>
          <tbody>
            {data.files.map((file) => (
              <tr key={file.name} className="border-b border-[var(--color-border-default)] last:border-0 hover:bg-[var(--color-bg-hover)]">
                <td className="px-4 py-3 font-mono text-xs">{file.name}</td>
                <td className="px-4 py-3">
                  {file.exists ? (
                    <span className="text-xs text-emerald-400 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      Found
                    </span>
                  ) : (
                    <span className="text-xs text-[var(--color-text-muted)] flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-text-muted)]" />
                      Missing
                    </span>
                  )}
                </td>
                <td className="px-4 py-3 text-right text-xs text-[var(--color-text-secondary)]">
                  {file.exists ? `${file.size.toLocaleString()} B` : "\u2014"}
                </td>
                <td className="px-4 py-3 text-right text-xs text-[var(--color-text-muted)]">
                  {file.modifiedAt ? new Date(file.modifiedAt).toLocaleDateString() : "\u2014"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function StatCard({ label, value, sub }: { label: string; value: string | number; sub: string }) {
  return (
    <div className="bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg p-4">
      <p className="text-xs text-[var(--color-text-muted)] mb-1">{label}</p>
      <p className="text-2xl font-semibold">{value}</p>
      <p className="text-xs text-[var(--color-text-secondary)] mt-1">{sub}</p>
    </div>
  )
}

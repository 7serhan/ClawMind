"use client"

import { useEffect, useState } from "react"
import SearchBox from "@/components/SearchBox"

interface SearchableFile {
  name: string
  content: string
  type: "core" | "daily"
}

export default function SearchPage() {
  const [files, setFiles] = useState<SearchableFile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/search")
      .then((r) => r.json())
      .then((data) => {
        setFiles(data.files)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <div className="space-y-4 animate-pulse">
        <div className="h-8 w-48 bg-[var(--color-bg-tertiary)] rounded" />
        <div className="h-12 bg-[var(--color-bg-secondary)] rounded-lg" />
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-xl font-semibold">Search</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">
          Search across {files.length} files
        </p>
      </div>

      <SearchBox files={files} />
    </div>
  )
}

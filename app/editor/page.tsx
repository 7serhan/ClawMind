"use client"

import { useEffect, useState, useCallback } from "react"

const TABS = ["MEMORY.md", "AGENTS.md", "SOUL.md", "USER.md"]

export default function EditorPage() {
  const [activeTab, setActiveTab] = useState("MEMORY.md")
  const [content, setContent] = useState("")
  const [savedContent, setSavedContent] = useState("")
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveStatus, setSaveStatus] = useState<"idle" | "saved" | "error">("idle")

  const fetchFile = useCallback((fileName: string) => {
    setLoading(true)
    fetch(`/api/files?file=${fileName}`)
      .then((r) => r.json())
      .then((data) => {
        setContent(data.content)
        setSavedContent(data.content)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  useEffect(() => {
    fetchFile(activeTab)
  }, [activeTab, fetchFile])

  async function handleSave() {
    setSaving(true)
    setSaveStatus("idle")

    try {
      const res = await fetch("/api/files", {
        method: "PUT",
        headers: { "Content-Type": "application/json", "X-ClawMind-Request": "1" },
        body: JSON.stringify({ fileName: activeTab, content }),
      })

      if (res.ok) {
        setSavedContent(content)
        setSaveStatus("saved")
        setTimeout(() => setSaveStatus("idle"), 2000)
      } else {
        setSaveStatus("error")
      }
    } catch {
      setSaveStatus("error")
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = content !== savedContent

  return (
    <div className="flex flex-col h-[calc(100vh-3rem)]">
      <div className="mb-4">
        <h2 className="text-xl font-semibold">Editor</h2>
        <p className="text-sm text-[var(--color-text-muted)] mt-1">Edit workspace files directly</p>
      </div>

      <div className="flex items-center justify-between mb-3">
        <div className="flex gap-1">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`text-xs px-3 py-1.5 rounded-t-lg border border-b-0 transition-colors font-mono ${
                activeTab === tab
                  ? "bg-[var(--color-bg-secondary)] border-[var(--color-border-default)] text-[var(--color-text-primary)]"
                  : "border-transparent text-[var(--color-text-muted)] hover:text-[var(--color-text-secondary)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          {saveStatus === "saved" && (
            <span className="text-xs text-emerald-400">Saved</span>
          )}
          {saveStatus === "error" && (
            <span className="text-xs text-[var(--color-error)]">Failed to save</span>
          )}
          <button
            onClick={handleSave}
            disabled={!hasChanges || saving}
            className={`text-xs px-4 py-1.5 rounded-lg transition-colors ${
              hasChanges
                ? "bg-[var(--color-accent)] text-white hover:bg-[var(--color-accent-hover)]"
                : "bg-[var(--color-bg-tertiary)] text-[var(--color-text-muted)] cursor-not-allowed"
            }`}
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>

      <div className="flex-1 bg-[var(--color-bg-secondary)] border border-[var(--color-border-default)] rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-4 animate-pulse">
            <div className="h-4 w-full bg-[var(--color-bg-tertiary)] rounded mb-2" />
            <div className="h-4 w-3/4 bg-[var(--color-bg-tertiary)] rounded mb-2" />
            <div className="h-4 w-1/2 bg-[var(--color-bg-tertiary)] rounded" />
          </div>
        ) : (
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full h-full bg-transparent text-sm text-[var(--color-text-primary)] p-4 resize-none focus:outline-none leading-relaxed"
            spellCheck={false}
          />
        )}
      </div>
    </div>
  )
}

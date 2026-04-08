import path from "path"
import fs from "fs"

export interface HealthCheck {
  id: string
  label: string
  status: "ok" | "warn" | "error"
  message: string
  docsUrl?: string
}

export function runHealthChecks(workspacePath: string): HealthCheck[] {
  const checks: HealthCheck[] = []

  // 1. MEMORY.md size
  const memoryPath = path.join(workspacePath, "MEMORY.md")
  try {
    const content = fs.readFileSync(memoryPath, "utf-8")
    const charCount = content.length

    if (charCount === 0) {
      checks.push({
        id: "memory-empty",
        label: "MEMORY.md Empty",
        status: "warn",
        message: "MEMORY.md exists but has no content. The agent has not stored any long-term memories yet.",
      })
    } else if (charCount > 16000) {
      checks.push({
        id: "memory-size",
        label: "MEMORY.md Size",
        status: "warn",
        message: `MEMORY.md is ${charCount.toLocaleString()} characters. Consider pruning entries to stay under 16,000.`,
      })
    } else {
      checks.push({
        id: "memory-size",
        label: "MEMORY.md Size",
        status: "ok",
        message: `${charCount.toLocaleString()} characters (limit: 16,000)`,
      })
    }
  } catch {
    checks.push({
      id: "memory-missing",
      label: "MEMORY.md",
      status: "error",
      message: "MEMORY.md not found in workspace.",
    })
  }

  // 2. Total bootstrap size
  const coreFiles = ["MEMORY.md", "AGENTS.md", "SOUL.md", "USER.md"]
  let totalSize = 0
  for (const file of coreFiles) {
    try {
      const content = fs.readFileSync(path.join(workspacePath, file), "utf-8")
      totalSize += content.length
    } catch {
      // File doesn't exist, skip
    }
  }

  if (totalSize > 120000) {
    checks.push({
      id: "bootstrap-size",
      label: "Total Bootstrap Size",
      status: "warn",
      message: `Total workspace files are ${totalSize.toLocaleString()} characters. Recommended limit is 120,000.`,
    })
  } else {
    checks.push({
      id: "bootstrap-size",
      label: "Total Bootstrap Size",
      status: "ok",
      message: `${totalSize.toLocaleString()} characters (limit: 120,000)`,
    })
  }

  // 3. Stale daily notes
  const memoryDir = path.join(workspacePath, "memory")
  try {
    const noteFiles = fs
      .readdirSync(memoryDir)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
      .sort()

    if (noteFiles.length === 0) {
      checks.push({
        id: "daily-notes-empty",
        label: "Daily Notes",
        status: "warn",
        message: "No daily note files found in memory directory.",
      })
    } else {
      const latestDate = noteFiles[noteFiles.length - 1].replace(".md", "")
      const daysSince = Math.floor(
        (Date.now() - new Date(latestDate).getTime()) / (1000 * 60 * 60 * 24)
      )

      if (daysSince > 7) {
        checks.push({
          id: "daily-notes-stale",
          label: "Daily Notes",
          status: "warn",
          message: `Last daily note is ${daysSince} days old (${latestDate}). The agent may not be active.`,
        })
      } else {
        checks.push({
          id: "daily-notes",
          label: "Daily Notes",
          status: "ok",
          message: `${noteFiles.length} notes, latest: ${latestDate}`,
        })
      }
    }
  } catch {
    checks.push({
      id: "daily-notes-missing",
      label: "Daily Notes",
      status: "error",
      message: "Memory directory not found.",
    })
  }

  // 4. DREAMS.md check
  const dreamsPath = path.join(workspacePath, "DREAMS.md")
  try {
    const content = fs.readFileSync(dreamsPath, "utf-8")
    if (content.trim().length === 0) {
      checks.push({
        id: "dreams-empty",
        label: "DREAMS.md",
        status: "warn",
        message: "DREAMS.md exists but is empty.",
      })
    } else {
      checks.push({
        id: "dreams",
        label: "DREAMS.md",
        status: "ok",
        message: "Dreaming is active.",
      })
    }
  } catch {
    checks.push({
      id: "dreams-missing",
      label: "DREAMS.md",
      status: "ok",
      message: "DREAMS.md not found. Dreaming is not enabled.",
    })
  }

  // 5. Core files existence
  const requiredFiles = ["AGENTS.md", "SOUL.md", "USER.md"]
  for (const file of requiredFiles) {
    const filePath = path.join(workspacePath, file)
    if (!fs.existsSync(filePath)) {
      checks.push({
        id: `missing-${file.toLowerCase()}`,
        label: file,
        status: "warn",
        message: `${file} not found in workspace.`,
      })
    }
  }

  return checks
}

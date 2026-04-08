import path from "path"
import os from "os"
import fs from "fs"

export function resolveWorkspacePath(): string | null {
  // 1. Environment variable
  const envPath = process.env.CLAWMIND_WORKSPACE
  if (envPath && fs.existsSync(envPath)) {
    return envPath
  }

  // 2. OpenClaw config file
  const configPath = path.join(os.homedir(), ".openclaw", "openclaw.json")
  if (fs.existsSync(configPath)) {
    try {
      const config = JSON.parse(fs.readFileSync(configPath, "utf-8"))
      const workspacePath = config?.agents?.defaults?.workspace
      if (workspacePath && fs.existsSync(workspacePath)) {
        return workspacePath
      }
    } catch {
      // Invalid JSON, skip
    }
  }

  // 3. Default fallback
  const defaultPath = path.join(os.homedir(), ".openclaw", "workspace")
  if (fs.existsSync(defaultPath)) {
    return defaultPath
  }

  return null
}

export interface WorkspaceStats {
  path: string
  files: {
    name: string
    exists: boolean
    size: number
    modifiedAt: string | null
  }[]
  dailyNotes: {
    count: number
    oldest: string | null
    newest: string | null
  }
}

export function getWorkspaceStats(workspacePath: string): WorkspaceStats {
  const coreFiles = ["MEMORY.md", "AGENTS.md", "SOUL.md", "USER.md", "DREAMS.md"]

  const files = coreFiles.map((name) => {
    const filePath = path.join(workspacePath, name)
    try {
      const stat = fs.statSync(filePath)
      return {
        name,
        exists: true,
        size: stat.size,
        modifiedAt: stat.mtime.toISOString(),
      }
    } catch {
      return {
        name,
        exists: false,
        size: 0,
        modifiedAt: null,
      }
    }
  })

  const memoryDir = path.join(workspacePath, "memory")
  let dailyNotes = { count: 0, oldest: null as string | null, newest: null as string | null }

  if (fs.existsSync(memoryDir)) {
    const noteFiles = fs
      .readdirSync(memoryDir)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
      .sort()

    dailyNotes = {
      count: noteFiles.length,
      oldest: noteFiles.length > 0 ? noteFiles[0].replace(".md", "") : null,
      newest: noteFiles.length > 0 ? noteFiles[noteFiles.length - 1].replace(".md", "") : null,
    }
  }

  return {
    path: workspacePath,
    files,
    dailyNotes,
  }
}

import { NextResponse } from "next/server"
import path from "path"
import fs from "fs"
import { resolveWorkspacePath } from "@/lib/workspace"

export interface SearchableFile {
  name: string
  content: string
  type: "core" | "daily"
}

export async function GET() {
  const workspacePath = resolveWorkspacePath()
  if (!workspacePath) {
    return NextResponse.json({ files: [] })
  }

  const files: SearchableFile[] = []

  // Core files
  const coreFiles = ["MEMORY.md", "AGENTS.md", "SOUL.md", "USER.md", "DREAMS.md"]
  for (const name of coreFiles) {
    try {
      const content = fs.readFileSync(path.join(workspacePath, name), "utf-8")
      files.push({ name, content, type: "core" })
    } catch {
      // Skip missing files
    }
  }

  // Daily notes
  const memoryDir = path.join(workspacePath, "memory")
  try {
    const noteFiles = fs
      .readdirSync(memoryDir)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))

    for (const f of noteFiles) {
      const content = fs.readFileSync(path.join(memoryDir, f), "utf-8")
      files.push({ name: `memory/${f}`, content, type: "daily" })
    }
  } catch {
    // No memory directory
  }

  return NextResponse.json({ files })
}

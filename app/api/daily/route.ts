import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs"
import { resolveWorkspacePath } from "@/lib/workspace"

export interface DailyNote {
  date: string
  content: string
  size: number
}

export async function GET(request: NextRequest) {
  const workspacePath = resolveWorkspacePath()
  if (!workspacePath) {
    return NextResponse.json({ notes: [] })
  }

  const memoryDir = path.join(workspacePath, "memory")

  try {
    const files = fs
      .readdirSync(memoryDir)
      .filter((f) => /^\d{4}-\d{2}-\d{2}\.md$/.test(f))
      .sort()
      .reverse()

    const date = request.nextUrl.searchParams.get("date")

    if (date) {
      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
        return NextResponse.json({ error: "Invalid date format" }, { status: 400 })
      }
      const filePath = path.join(memoryDir, `${date}.md`)
      const resolved = path.resolve(filePath)
      if (!resolved.startsWith(path.resolve(memoryDir))) {
        return NextResponse.json({ error: "Invalid path" }, { status: 400 })
      }
      try {
        const content = fs.readFileSync(filePath, "utf-8")
        return NextResponse.json({
          note: { date, content, size: content.length },
        })
      } catch {
        return NextResponse.json({ note: null })
      }
    }

    const notes: DailyNote[] = files.map((f) => {
      const filePath = path.join(memoryDir, f)
      const content = fs.readFileSync(filePath, "utf-8")
      return {
        date: f.replace(".md", ""),
        content,
        size: content.length,
      }
    })

    return NextResponse.json({ notes })
  } catch {
    return NextResponse.json({ notes: [] })
  }
}

import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs"
import { resolveWorkspacePath } from "@/lib/workspace"
import { parseMemoryFile } from "@/lib/parser"

export async function GET() {
  const workspacePath = resolveWorkspacePath()
  if (!workspacePath) {
    return NextResponse.json({ entries: [], raw: "" })
  }

  const memoryPath = path.join(workspacePath, "MEMORY.md")
  try {
    const content = fs.readFileSync(memoryPath, "utf-8")
    const entries = parseMemoryFile(content)
    return NextResponse.json({ entries, raw: content })
  } catch {
    return NextResponse.json({ entries: [], raw: "" })
  }
}

export async function PUT(request: NextRequest) {
  const workspacePath = resolveWorkspacePath()
  if (!workspacePath) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
  }

  const body = await request.json()
  const content = body?.content
  if (typeof content !== "string") {
    return NextResponse.json({ error: "Content must be a string" }, { status: 400 })
  }
  if (content.length > 500_000) {
    return NextResponse.json({ error: "Content too large" }, { status: 413 })
  }
  const memoryPath = path.join(workspacePath, "MEMORY.md")

  try {
    fs.writeFileSync(memoryPath, content, "utf-8")
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json(
      { error: "Failed to write file" },
      { status: 500 }
    )
  }
}

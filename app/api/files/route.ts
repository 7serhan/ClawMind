import { NextRequest, NextResponse } from "next/server"
import path from "path"
import fs from "fs"
import { resolveWorkspacePath } from "@/lib/workspace"

const ALLOWED_FILES = ["MEMORY.md", "AGENTS.md", "SOUL.md", "USER.md"]

export async function GET(request: NextRequest) {
  const workspacePath = resolveWorkspacePath()
  if (!workspacePath) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
  }

  const fileName = request.nextUrl.searchParams.get("file")
  if (!fileName || !ALLOWED_FILES.includes(fileName)) {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 })
  }

  const filePath = path.join(workspacePath, fileName)
  try {
    const content = fs.readFileSync(filePath, "utf-8")
    return NextResponse.json({ content, fileName })
  } catch {
    return NextResponse.json({ content: "", fileName })
  }
}

export async function PUT(request: NextRequest) {
  const workspacePath = resolveWorkspacePath()
  if (!workspacePath) {
    return NextResponse.json({ error: "Workspace not found" }, { status: 404 })
  }

  const body = await request.json()
  const { fileName } = body
  const content = body?.content
  if (!fileName || !ALLOWED_FILES.includes(fileName)) {
    return NextResponse.json({ error: "Invalid file name" }, { status: 400 })
  }
  if (typeof content !== "string") {
    return NextResponse.json({ error: "Content must be a string" }, { status: 400 })
  }
  if (content.length > 500_000) {
    return NextResponse.json({ error: "Content too large" }, { status: 413 })
  }

  const filePath = path.join(workspacePath, fileName)
  try {
    fs.writeFileSync(filePath, content, "utf-8")
    return NextResponse.json({ success: true })
  } catch {
    return NextResponse.json({ error: "Failed to write file" }, { status: 500 })
  }
}

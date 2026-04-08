import { NextResponse } from "next/server"
import path from "path"
import fs from "fs"
import { resolveWorkspacePath } from "@/lib/workspace"

export async function GET() {
  const workspacePath = resolveWorkspacePath()
  if (!workspacePath) {
    return NextResponse.json({ content: null, exists: false })
  }

  const dreamsPath = path.join(workspacePath, "DREAMS.md")
  try {
    const content = fs.readFileSync(dreamsPath, "utf-8")
    return NextResponse.json({ content, exists: true })
  } catch {
    return NextResponse.json({ content: null, exists: false })
  }
}

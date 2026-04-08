import { NextResponse } from "next/server"
import { resolveWorkspacePath, getWorkspaceStats } from "@/lib/workspace"

export async function GET() {
  const workspacePath = resolveWorkspacePath()

  if (!workspacePath) {
    return NextResponse.json(
      { error: "Workspace not found", path: null },
      { status: 404 }
    )
  }

  const stats = getWorkspaceStats(workspacePath)
  return NextResponse.json(stats)
}

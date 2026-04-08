import { NextResponse } from "next/server"
import { resolveWorkspacePath } from "@/lib/workspace"
import { runHealthChecks } from "@/lib/health"

export async function GET() {
  const workspacePath = resolveWorkspacePath()
  if (!workspacePath) {
    return NextResponse.json({
      checks: [
        {
          id: "workspace-missing",
          label: "Workspace",
          status: "error",
          message: "No workspace found. Set CLAWMIND_WORKSPACE or configure OpenClaw.",
        },
      ],
    })
  }

  const checks = runHealthChecks(workspacePath)
  return NextResponse.json({ checks })
}

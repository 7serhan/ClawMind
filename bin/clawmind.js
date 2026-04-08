#!/usr/bin/env node

const { spawnSync } = require("child_process")
const path = require("path")
const fs = require("fs")
const os = require("os")

const rawPort = process.env.PORT || "3421"
const PORT = parseInt(rawPort, 10)
if (isNaN(PORT) || PORT < 1 || PORT > 65535) {
  console.error("Invalid PORT value:", rawPort)
  process.exit(1)
}

const projectDir = path.resolve(__dirname, "..")

console.log(`\n  ClawMind - Memory Explorer for OpenClaw`)
console.log(`  Starting on http://localhost:${PORT}\n`)

// Check workspace
const workspace =
  process.env.CLAWMIND_WORKSPACE ||
  (() => {
    const configPath = path.join(os.homedir(), ".openclaw", "openclaw.json")
    if (fs.existsSync(configPath)) {
      try {
        const config = JSON.parse(fs.readFileSync(configPath, "utf-8"))
        return config?.agents?.defaults?.workspace
      } catch {
        return null
      }
    }
    return null
  })() ||
  path.join(os.homedir(), ".openclaw", "workspace")

if (fs.existsSync(workspace)) {
  console.log(`  Workspace: ${workspace}\n`)
} else {
  console.log(`  Warning: No workspace found at ${workspace}`)
  console.log(`  Set CLAWMIND_WORKSPACE to override.\n`)
}

const result = spawnSync("npm", ["start", "--", "-p", String(PORT), "-H", "127.0.0.1"], {
  cwd: projectDir,
  stdio: "inherit",
  env: { ...process.env, PORT: String(PORT) },
  shell: true,
})

if (result.status !== 0) {
  process.exit(1)
}

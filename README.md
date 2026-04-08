# ClawMind

A local web dashboard for visualizing and editing [OpenClaw](https://github.com/AiCEG/OpenClaw) workspace memory files.

OpenClaw stores agent memory across markdown files like `MEMORY.md`, `AGENTS.md`, `SOUL.md`, daily notes, and more. **ClawMind** gives you a clean UI to explore, search, edit, and monitor the health of these files — without touching the terminal.

![Dashboard](https://img.shields.io/badge/status-beta-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Local Only](https://img.shields.io/badge/cloud-none-brightgreen)

---

## Features

| Feature | Description |
|---|---|
| **Dashboard** | File stats, size warnings, modification dates at a glance |
| **Memory Cards** | `MEMORY.md` entries parsed and categorized (Preferences, Decisions, People, Projects, Rules) |
| **Daily Notes Timeline** | Calendar view with date picker, note previews, and character counts |
| **DREAMS.md Viewer** | Dreaming sweep diary with promoted/skipped entries and relevance scores |
| **Full-Text Search** | Fuzzy search across all workspace files with highlighted results |
| **Health Panel** | Size limits, stale notes, missing files — auto-refreshing every 30s |
| **File Editor** | Tabbed editor for MEMORY.md, AGENTS.md, SOUL.md, USER.md |

## Tech Stack

- **Next.js 15** (App Router)
- **Tailwind CSS** (dark theme)
- **Fuse.js** (client-side fuzzy search)
- **Node.js `fs`** (file I/O via API routes)
- No database, no cloud, no telemetry

## Quick Start

### Prerequisites

- Node.js 18+
- An OpenClaw workspace (or use the included test workspace)

### Install & Run

```bash
git clone https://github.com/7serhan/ClawMind.git
cd ClawMind
npm install
npm run dev
```

Open **http://localhost:3421**

### Point to Your Workspace

By default, ClawMind looks for your workspace in this order:

1. `CLAWMIND_WORKSPACE` environment variable
2. `~/.openclaw/openclaw.json` config file (`agents.defaults.workspace`)
3. `~/.openclaw/workspace/` (default fallback)

To use a custom path:

```bash
# Linux / macOS
CLAWMIND_WORKSPACE=/path/to/your/workspace npm run dev

# Windows (PowerShell)
$env:CLAWMIND_WORKSPACE="C:\path\to\your\workspace"; npm run dev
```

Or create a `.env.local` file in the project root:

```
CLAWMIND_WORKSPACE=/path/to/your/workspace
```

### Test Without OpenClaw

A `test-workspace/` directory with sample data is included. To use it:

```
CLAWMIND_WORKSPACE=./test-workspace
```

This is already configured in `.env.local` by default.

## Project Structure

```
clawmind/
├── app/
│   ├── page.tsx              # Dashboard
│   ├── memory/page.tsx       # Memory cards
│   ├── timeline/page.tsx     # Daily notes timeline
│   ├── dreams/page.tsx       # DREAMS.md viewer
│   ├── search/page.tsx       # Full-text search
│   ├── health/page.tsx       # Health checks
│   ├── editor/page.tsx       # File editor
│   └── api/
│       ├── workspace/        # Workspace stats
│       ├── memory/           # Memory entries (read/write)
│       ├── daily/            # Daily notes
│       ├── dreams/           # DREAMS.md
│       ├── files/            # File read/write
│       ├── search/           # Search index
│       └── health/           # Health checks
├── components/               # UI components
├── lib/                      # Workspace resolver, parser, health checks
├── bin/                      # npx entry point
└── test-workspace/           # Sample data for testing
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/workspace` | Workspace path, file stats, daily note count |
| GET | `/api/memory` | Parsed memory entries + raw content |
| PUT | `/api/memory` | Update MEMORY.md |
| GET | `/api/daily` | All daily notes (or single with `?date=YYYY-MM-DD`) |
| GET | `/api/dreams` | DREAMS.md content |
| GET | `/api/files?file=X` | Read a core file |
| PUT | `/api/files` | Update a core file |
| GET | `/api/search` | All file contents for search indexing |
| GET | `/api/health` | Health check results |

## Security

ClawMind is designed to run **locally only** on your machine:

- Binds to `127.0.0.1` — not accessible from your network
- CSRF protection via custom header on all write operations
- Path traversal protection on all file endpoints
- File allowlist — only `MEMORY.md`, `AGENTS.md`, `SOUL.md`, `USER.md` are writable
- Write size limit (500KB) to prevent disk abuse
- Input validation on all API endpoints
- No external network calls, no analytics, no telemetry

## Production Build

```bash
npm run build
npm start
```

---

## FAQ

### What is ClawMind?

ClawMind is a local web interface for browsing and editing the memory files that [OpenClaw](https://github.com/AiCEG/OpenClaw) creates. Instead of opening markdown files in a text editor, you get a dashboard with categories, a calendar, search, and health monitoring.

### What is OpenClaw?

OpenClaw is an open-source framework that gives AI agents long-term memory. It stores memories as simple markdown files in a workspace directory on your computer. ClawMind reads those files and presents them visually.

### Do I need OpenClaw installed to use ClawMind?

**No.** A `test-workspace/` with sample data is included so you can explore the UI immediately. To use your real data, just point `CLAWMIND_WORKSPACE` to your OpenClaw workspace directory.

### Does ClawMind send my data anywhere?

**No.** ClawMind runs 100% locally on your machine. There are no external API calls, no analytics, no tracking, no cloud sync. Your memory files never leave your computer.

### What files does ClawMind read?

| File | Purpose |
|---|---|
| `MEMORY.md` | Long-term memory entries (preferences, decisions, people, etc.) |
| `AGENTS.md` | Agent behavior instructions |
| `SOUL.md` | Agent personality guidelines |
| `USER.md` | User context information |
| `DREAMS.md` | Dreaming sweep diary (auto-promotion log) |
| `memory/*.md` | Daily notes (one file per day, named `YYYY-MM-DD.md`) |

### Can ClawMind modify my files?

Yes, but only through the **Editor** tab, and only for 4 files: `MEMORY.md`, `AGENTS.md`, `SOUL.md`, and `USER.md`. Daily notes and DREAMS.md are read-only. All writes require explicit user action (clicking "Save").

### What do the Health checks monitor?

- **MEMORY.md Size** — Warns if over 16,000 characters (OpenClaw recommended limit)
- **Total Bootstrap Size** — Warns if all core files combined exceed 120,000 characters
- **Daily Notes** — Warns if no notes exist or the latest is more than 7 days old
- **DREAMS.md** — Shows if dreaming is active or not configured

### What port does it run on?

Port **3421** by default. Change it with the `PORT` environment variable:

```bash
PORT=8080 npm run dev
```

### How do I update ClawMind?

```bash
cd ClawMind
git pull
npm install
npm run build
```

### I see "No Workspace Found" — what do I do?

This means ClawMind can't locate your workspace. Fix it by:

1. Setting the environment variable: `CLAWMIND_WORKSPACE=/your/path`
2. Or creating a `.env.local` file with: `CLAWMIND_WORKSPACE=/your/path`
3. Or making sure `~/.openclaw/workspace/` exists

### Can I use this on a remote server?

ClawMind is designed for local use only. It binds to `127.0.0.1` and is not accessible from other machines on your network. If you need remote access, use a VPN or SSH tunnel — do not expose it directly.

### My workspace has hundreds of daily notes — will it be slow?

The search index loads all files into memory on the Search page. For very large workspaces (500+ notes), the initial load may take a moment, but Fuse.js search itself is fast. Dashboard, Timeline, and other pages are unaffected.

---

## Contributing

Contributions are welcome! Please open an issue first to discuss what you'd like to change.

1. Fork the repo
2. Create your branch (`git checkout -b feature/my-feature`)
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

[MIT](LICENSE)

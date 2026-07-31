# Setup — Vitalize Interview

Run this **before** the interview. It should take ~10 minutes once Docker is installed. If you hit any issue, message us so we can sort it out before we're on a clock together.

The actual interview question stays sealed until we sit down — this doc is only to make sure your machine is ready to go.

---

## What you're getting

A small TypeScript monorepo:

- **`apps/web`** — React 19 + Vite + Tailwind, state via `@effect-atom/atom-react`.
- **`apps/server`** — Bun + `@effect/rpc` + Drizzle, talking to Postgres.
- **`apps/mock-partner`** — Bun HTTP server on `:3002` that receives webhook POSTs for the interview task.
- **`packages/*`** — shared types, a small date utility, ESLint and TS config.

We won't ask you to read the code ahead of time, and we won't walk through it together during the interview — how you prepare is up to you. In our experience, the strongest candidates spend a little time poking around beforehand. If you do, the highest-leverage things to look at are the tools we use and how the current architecture fits together.

## Prerequisites

1. **Docker.** Either:
   - [OrbStack](https://orbstack.dev) (recommended on macOS — faster, lower-overhead), or
   - [Docker Desktop](https://www.docker.com/products/docker-desktop)
   - Must include **Docker Compose v2** (the setup script checks `docker compose version`).
2. **A POSIX shell.** macOS and Linux work out of the box. On Windows, please use WSL2.
3. **An editor with an AI agent you're comfortable with.** Cursor, Claude Code, Codex, Copilot, Continue — your choice. You'll be encouraged to use AI during the interview. Make sure you're signed in and your agent works in this repo *before* we start.
4. **Network access** during setup — the script installs Bun and pulls the Postgres image.

You do **not** need to install Bun, Node, or Postgres manually. The setup script handles all of that.

## Setup

From the repo root:

```bash
./setup.sh
```

This will:

1. Install **Bun** via the official installer if you don't have it (adds `~/.bun/bin` to your `PATH` — you may need a new shell afterward).
2. Run `bun install` to pull all workspace dependencies (`apps/*`, `packages/*`).
3. Start a Postgres 17 container via `docker compose up -d postgres`. The container is named `vitalize-interview-postgres` and exposes `localhost:5433` → container `5432`.
4. Run database migrations (`bun migrate`).
5. Seed sample data (`bun seed`).
6. Offer to start the dev servers.

If the script asks at the end whether you want to start `bun dev`, say yes once so you can confirm the dev servers come up cleanly.

## Verify it works

You can either let the setup script start the dev servers, or run them yourself:

```bash
bun dev
```

That starts the web app (Vite), the server (Bun + RPC), the mock partner
receiver, and Drizzle Studio via Turbo.

Now open these and confirm:

- **`http://localhost:3000`** — the web app. You should see a heading "Manager Schedule" and a grid with profile rows and date columns. Some cells will have an `X` in them (those are seeded shift *preferences*).
- **`http://localhost:3001/rpc`** — the server. You'll get an error response if you visit it in a browser, which is fine — what matters is the server is reachable. If `curl -s -o /dev/null -w "%{http_code}" http://localhost:3001/rpc` returns anything other than a connection error, you're good.
- **`http://localhost:3002/webhook`** — the mock partner. `curl -X POST http://localhost:3002/webhook -H 'content-type: application/json' -d '{"deliveryId":"abc"}'` should print a JSON log line in the `mock-partner` turbo pane.
- **Tests run.** From the repo root:
  ```bash
  bun test
  ```
  Some tests are intentionally unimplemented and will be marked as
  skipped — that's expected. What matters is that the test runner
  *executes* without crashing and the suite is green out of the box.

If all four pass, you're ready.

### Environment variables

Copy `.env.example` to `.env` (the root scripts load it via `dotenv-cli`
before invoking turbo). It declares:

| Variable                | Used by                                    |
| ----------------------- | ------------------------------------------ |
| `DATABASE_URL`          | server + drizzle CLI                       |
| `WEBHOOK_RECEIVER_URL`  | *the candidate's code* — defaults to the mock partner at `http://localhost:3002/webhook` |
| `WEBHOOK_SECRET`        | *the candidate's code* — shared secret used to sign outbound webhooks (`interview-shared-secret`) |

### Tests: two layers

`bun test` discovers `*.unit.test.ts` (pure, no I/O) and `*.db.test.ts`
(Postgres-backed). DB tests opt into a clean schema by importing
`src/db/database-setup` — see the stub in `apps/server/src/webhooks/` for the
pattern.

## Useful commands

You won't need most of these, but they're here for reference:

| Command           | What it does                                              |
| ----------------- | --------------------------------------------------------- |
| `bun dev`         | Start web (3000) + server (3001) + mock partner (3002) + Drizzle Studio |
| `bun test`        | Run all tests across the monorepo                         |
| `bun type-check`  | TypeScript across the whole monorepo                      |
| `bun lint`        | ESLint                                                    |
| `bun migrate`     | Apply Drizzle migrations                                  |
| `bun generate`    | Generate a new Drizzle migration from schema changes      |
| `bun seed`        | Reset & re-seed the database                              |
| `bun studio`      | Open Drizzle Studio (DB browser) in the browser           |

To re-create the database from scratch (e.g. if something gets wedged):

```bash
docker compose down -v   # drops the volume, wiping data
./setup.sh               # re-runs everything
```

## Common gotchas

- **"Bun command not found" after install.** Open a new shell or run `export PATH="$HOME/.bun/bin:$PATH"`.
- **Port 5433 in use.** You have another Postgres on that port. Either stop it, or edit `docker-compose.yml` (and the matching connection string) to use a free port. Tell us so we don't waste interview time on it.
- **Port 3000 or 3001 in use.** Stop whatever's bound there before `bun dev`.
- **`docker compose` reports v1, not v2.** Update Docker Desktop, or switch to OrbStack.
- **Apple Silicon and Docker Desktop feel slow.** OrbStack is meaningfully faster on M-series Macs — worth switching if you have time.
- **Tests crash with a Bun error.** Make sure `bun --version` reports `1.3.x` or newer. The `setup.sh` script handles this, but if you had an older Bun pre-installed it'll keep using it. Run `bun upgrade` if needed.

## On using AI during the interview

You're encouraged to use AI tools the way you do every day. We're not testing whether you can write code from memory — we're testing how you scope, sequence, and make trade-offs with AI as a collaborator. A few notes:

- **The interview prompt itself will be hidden from your AI agent** (via `.cursorignore` and equivalent boundaries). You'll read it as a human and translate it into prompts and decisions yourself.
- **Narrate as you go.** "I'm asking it to do X because Y" is exactly what we want to hear.
- **Read the diffs.** We'll ask why you accepted them.

That's it. See you at the interview.

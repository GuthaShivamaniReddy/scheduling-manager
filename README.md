# Vitalize Interview

This live interview is meant to take <45 minutes. Good luck!

### Prerequisites

- [OrbStack](https://orbstack.dev) or [Docker Desktop](https://www.docker.com/products/docker-desktop) — must include **Docker Compose v2** (the script checks `docker compose version`).

### Setup

`./setup.sh` does the following (so nothing here should be a surprise). **Bun install and the Docker image pull need internet access.**

1. **Bun** — If `bun` is missing, installs it with the [official install script](https://bun.sh/docs/installation) (adds `~/.bun/bin` to your PATH; you may need a new shell afterward).
2. **JavaScript dependencies** — Runs `bun install` at the repo root to install all workspace packages from the lockfile (`apps/*`, `packages/*`).
3. **PostgreSQL in Docker** — Runs `docker compose up -d postgres` using the [PostgreSQL 17](https://hub.docker.com/_/postgres) image from `docker-compose.yml`, exposes **localhost:5433** → container `5432`, container name `vitalize-interview-postgres`.
4. **Database** — Runs migrations (`bun migrate`) and seeds sample data (`bun seed`).
5. **Optional** — May ask if you want to start the dev servers (`bun dev`).

You need Docker running before the script. It does not install OrbStack/Docker for you.

```bash
./setup.sh
```

Your interviewer will guide you through the rest.

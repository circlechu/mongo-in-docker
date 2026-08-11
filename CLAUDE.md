# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Purpose

This repo provides a containerized MongoDB 8.0 instance for the formpf3 application. It is infrastructure-only — no application code lives here.

## Prerequisites

Docker Desktop (Windows/Mac) or Docker Engine (Linux).

## Setup

Copy `.env.example` (or create `.env` manually) and set real passwords before first run:

```
MONGO_ROOT_USER=admin
MONGO_ROOT_PASSWORD=<strong password>
MONGO_DB=formpf3
```

## Common Commands

```bash
docker compose up -d          # Start MongoDB in background
docker compose down           # Stop (data persists in ./data/)
docker compose logs -f        # Tail logs
docker compose exec mongodb mongosh -u admin -p   # Open Mongo shell as root
```

## Architecture

- **`docker-compose.yml`** — single `formpf3-mongo` service (mongo:8.0), port 27017, restart `unless-stopped`
- **`init/01-create-user.js`** — runs once on first boot (when `./data/` is empty); creates the app-level user `formpf3_user` with `readWrite` on the `formpf3` database
- **`./data/`** — MongoDB data directory, bind-mounted into the container; gitignored
- **`./logs/`** — MongoDB log directory, bind-mounted; gitignored

## Initialization Scripts

Scripts in `init/` run inside `docker-entrypoint-initdb.d` on first boot only. They execute in filename order, so prefix additional scripts with a number (e.g., `02-seed-data.js`). To re-run init scripts, stop the container and delete `./data/`.

## Connection Strings

| Context | Connection string |
|---------|------------------|
| Local app | `mongodb://formpf3_user:changeme_app@localhost:27017/formpf3` |
| Remote server | Replace `localhost` with the server IP |

Application code should connect as `formpf3_user`, not the root admin.

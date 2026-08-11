# MongoDB in Docker

Runs a MongoDB 8.0 instance in Docker with an external data folder and pre-configured users.

## Prerequisites

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (Windows/Mac) or Docker Engine (Linux)

## Setup

1. Copy `.env` and set real passwords:

   ```env
   MONGO_ROOT_USER=admin
   MONGO_ROOT_PASSWORD=your_root_password
   MONGO_DB=formpf3
   ```

   Also update the app user password in [init/01-create-user.js](init/01-create-user.js).

1. Start the container:

   ```bash
   docker compose up -d
   ```

On first start, MongoDB will:

- Create the root admin using credentials from `.env`
- Run `init/01-create-user.js` to create the app-level user `formpf3_user`

Data is persisted in `./data/` on the host.

## Common Commands

```bash
# Start in background
docker compose up -d

# Stop
docker compose down

# View logs
docker logs formpf3-mongo

# Open a Mongo shell inside the container (as root)
docker exec -it formpf3-mongo mongosh -u admin -p your_root_password --authenticationDatabase admin

# Rebuild from scratch (WARNING: deletes all data)
docker compose down
rm -rf ./data
docker compose up -d
```

## Connecting from Your App

Use the app-level user (not root) in your connection string:

```text
mongodb://formpf3_user:changeme_app@localhost:27017/formpf3
```

## Connecting from a Remote Machine (e.g. your laptop → Linux server)

Ensure port `27017` is open in the server's firewall, then:

```text
mongodb://formpf3_user:changeme_app@<server-ip>:27017/formpf3
```

Or connect with a GUI tool (Compass, Studio 3T, etc.) using the same host/port/credentials.

## File Structure

```text
mongo-in-docker/
├── docker-compose.yml       # Service definition
├── .env                     # Credentials (gitignored — never commit this)
├── .gitignore
├── data/                    # MongoDB data files (gitignored)
├── logs/                    # MongoDB log files (gitignored)
└── init/
    └── 01-create-user.js    # Runs once on first boot to create the app user
```

## Notes

- The `init/` scripts only run when `data/` is empty (i.e. first boot or after a wipe).
- To add more databases or users, add more `.js` files under `init/` — they run in filename order.
- The root user is for admin tasks only; use `formpf3_user` from application code.

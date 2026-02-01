# Log Ingestion and Querying System

Full-stack take-home: Node.js backend for log ingestion and storage, React frontend for searching and viewing logs. Tech stack and API follow the assessment specification; coding practices follow the project's standards (Controller → Service → DB Service, JSDoc, no hardcoded values, structured logging).

## Overview

- **Backend:** Node.js + Express. Single JSON file as database (no external DB). POST `/logs` to ingest, GET `/logs` with optional query params to filter and list logs (reverse chronological).
- **Frontend:** React (Vite). Filter bar (message, level, resourceId, timestamp range), log list with level styling, loading/error states.

## Tech Stack (per assessment)

- **Backend:** Node.js, Express.js, single JSON file for persistence (fs; no MongoDB/Postgres/cloud).
- **Frontend:** React, Vite, fetch to backend API.

## Setup

### Backend

```bash
cd backend
cp .env.example .env   # optional: set PORT, CORS_ORIGIN, DATA_FILE
npm install
npm start
```

Default: server on port **3001**, CORS origin `http://localhost:5173`, data file `backend/data/logs.json`.

### Frontend

```bash
cd frontend
cp env.example .env    # optional: set VITE_API_URL (default http://localhost:3001)
npm install
npm run dev
```

Default: dev server on port **5173**, API URL `http://localhost:3001`.

## Push to GitHub (as Goldenmist00)

From the project root, run these in order. Use the same GitHub account as **Goldenmist00** when prompted to sign in.

```bash
cd "C:\Users\parth_gote\OneDrive\Desktop\Evallo ai"
```

If you had a failed init before, remove the repo and start clean:

```powershell
Remove-Item -Recurse -Force .git -ErrorAction SilentlyContinue
```

Then init, set author to Goldenmist00, add remote, and push:

```bash
git init
git config user.name "Goldenmist00"
git config user.email "Goldenmist00@users.noreply.github.com"
git remote add origin https://github.com/Goldenmist00/Log-query-interface.git
git add .
git commit -m "Initial commit: Log Ingestion and Querying System"
git branch -M main
git push -u origin main
```

When Git asks for credentials, sign in as **Goldenmist00** (GitHub username + password or personal access token). To use a token: GitHub → Settings → Developer settings → Personal access tokens → create one with `repo` scope; use the token as the password when pushing.

## Run

1. Start backend: `cd backend && npm start`
2. Start frontend: `cd frontend && npm run dev`
3. Open http://localhost:5173; use filters and (optionally) POST logs to test ingestion.

## Tests (bonus)

Backend unit tests (Jest) for `log.service`: validation (`validateLogBody`) and filtering (`query` with mocked db). Run from the backend folder:

```bash
cd backend
npm test
```

Covers: valid/invalid log body, missing fields, invalid level/timestamp/metadata, filter by level/message/resourceId/timestamp range, combined AND filters, empty result.

## Real-time (WebSocket, bonus)

When a log is ingested via POST `/logs`, the server broadcasts it to all connected WebSocket clients on the same port. The frontend subscribes to `ws://<API_HOST>` (derived from `VITE_API_URL`) and prepends new logs to the list without refetching. Restart the backend after pulling so the HTTP server and WebSocket server both run.

## Design Decisions

- **Persistence:** Single JSON file (`backend/data/logs.json`) as required. Node `fs` (readFile/writeFile) used; no node-json-db. File and directory created on first read/write.
- **Architecture:** Controller → Service → DB Service. Controllers handle HTTP only; all business logic (validation, filtering, sorting) in `log.service`; all file I/O in `db.service`. No business logic in controllers, no DB calls outside db.service.
- **Config:** PORT, CORS_ORIGIN, DATA_FILE from env via `config/constants.js`; no hardcoded URLs or ports.
- **Logging:** Minimal logger (`utils/logger.js`) writing to stdout/stderr; no `console.log` in production paths.
- **Validation:** Schema validation in service; ValidationError for 400; other errors map to 500.
- **Query params:** Keys defined once in `config/constants.js` (QUERY_PARAM_KEYS) and reused in controller to avoid duplication.
- **Frontend:** Vite for speed; filters drive GET `/logs` query params; optional debounce on message search (not required for assessment).
- **Real-time (bonus):** WebSocket server attached to same HTTP server; `broadcast(log)` called from controller after successful ingest; frontend subscribes and prepends new logs to the list.

## Coding Practices (project standards / docmost-style)

- **Controller → Service → DB Service** mandatory; business logic only in services; DB only in db.service.
- **JSDoc** on all public/exported functions; `@param`, `@returns`, `@throws` where applicable.
- **No hardcoded values:** config and QUERY_PARAM_KEYS in config; env for PORT, CORS, API URL.
- **Error handling:** try/catch in controllers; meaningful messages; 400 for validation, 500 for server/file errors.
- **No console.log:** logger used for startup and (if needed) errors.
- **Single responsibility / no duplication:** e.g. `sortByTimestampDesc` in service; query param keys from config.

## API Summary

| Method | Path   | Purpose |
|--------|--------|--------|
| POST   | /logs  | Ingest one log (body = JSON per schema). 201 + log; 400 invalid; 500 server error. |
| GET    | /logs  | Query logs. Query params (all optional): level, message, resourceId, timestamp_start, timestamp_end, traceId, spanId, commit. AND logic; response sorted by timestamp desc. 200 + array; 500 on error. |

Log schema: level, message, resourceId, timestamp (ISO 8601), traceId, spanId, commit, metadata (object). All required; level one of error, warn, info, debug.

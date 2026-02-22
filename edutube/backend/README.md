# EduTube — Backend API

Backend for **EduTube**: learning journeys, chapters, notes, and an AI chatbot. FastAPI + MongoDB. See [edutube/README.md](../README.md) for full project setup.

## Requirements

- Python 3.11+
- MongoDB (local or Atlas)

## Setup

1. **Create a virtualenv and install dependencies**

   ```bash
   # From edutube repo root
   cd backend
   python -m venv .venv

   # Activate the venv first (required — otherwise pip/uvicorn use system Python)
   # Git Bash / Linux / macOS:
   source .venv/Scripts/activate   # Windows (Git Bash)
   # source .venv/bin/activate      # Linux/macOS
   # PowerShell:  .venv\Scripts\Activate.ps1
   # CMD:         .venv\Scripts\activate.bat

   pip install -r requirements.txt
   ```

2. **Environment**

   Copy `.env.example` to `.env` and set:

   - `JWT_SECRET` — secret for JWT auth
   - `MONGODB_URL` — e.g. `mongodb://localhost:27017` or your Atlas URI
   - Optionally `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION` (and enable Nova Lite in Bedrock), `YT_KEY` for chatbot and YouTube playlist import
   - Optionally `S3_BUCKET` (and `S3_TRANSCRIPT_PREFIX`) for the knowledge-base pipeline (transcripts uploaded to S3 for later sync)

3. **Run the server**

   With the venv activated:

   ```bash
   uvicorn main:app --host 0.0.0.0 --port 5000
   ```

   If `uvicorn` is not found, use the module form:

   ```bash
   python -m uvicorn main:app --host 0.0.0.0 --port 5000
   ```

   Or use the port from your `.env` (e.g. `PORT=5000`).

## API

- **Base path:** `/api/v1`
- **Auth:** `Authorization: Bearer <token>` (JWT from `/api/v1/users/login`)
- **Users:** `POST /users/register`, `POST /users/login`, `GET /users/profile`, `GET /users`
- **Journeys:** `GET/POST /journeys`, `GET/PUT/DELETE /journeys/:id`, `POST /journeys/playlist`, `POST /journeys/:id/fork`, `GET /journeys/public`
- **Chapters:** `GET/POST /journeys/:journeyId/chapters`, `GET/PUT/DELETE /journeys/chapters/:id`, `PUT /journeys/chapters/isComplete/:id`
- **Notes:** `GET/POST .../chapters/:chapterId/notes`, `GET /journeys/:journeyId/notes`, `GET/PUT/DELETE /notes/:noteId`
- **Chatbot:** `POST /chatbot/chat`, `GET /chatbot/health`

Point the frontend at this server (e.g. `http://localhost:5000/api/v1`).

## Knowledge base pipeline

When a user creates a journey from a playlist or adds a chapter with a YouTube video link, the backend runs a **background task** (non-blocking) that:

1. Extracts the YouTube video ID from the link
2. Fetches the transcript via `youtube-transcript-api`
3. Uploads the transcript as a `.txt` file to S3 under `{S3_TRANSCRIPT_PREFIX}/{journey_id}/{video_id}[_{chapter_id}].txt`

Playlist and chapter creation responses return immediately; transcript extraction and S3 upload happen in parallel. Configure `S3_BUCKET` (and optionally `S3_TRANSCRIPT_PREFIX`, `S3_REGION`) to enable uploads; if unset, the pipeline skips S3 and only logs. You can sync these files into your RAG/knowledge base later.

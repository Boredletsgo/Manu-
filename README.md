# 🤟 ASL Learning App

A cross-platform American Sign Language (ASL) learning app. The **Expo
React Native** frontend (iOS, Android, web) talks to a **FastAPI** backend that
proxies a **local Ollama LLM** to power an AI tutor and quiz generation.

```
.
├── app/        # Expo React Native frontend (TypeScript + expo-router)
└── backend/    # FastAPI server proxying Ollama + serving sign data
```

## Features

| Screen      | Description                                                            |
|-------------|------------------------------------------------------------------------|
| **Home**    | Welcome screen with navigation to every feature.                       |
| **Learn**   | Browse the ASL alphabet, numbers, and phrases with GIFs, descriptions, and memory tips. Mark signs as learned. |
| **AI Tutor**| Chat UI that **streams** responses from the local LLM.                 |
| **Quiz**    | Flashcard-style multiple-choice quiz generated on demand by the LLM.   |
| **Progress**| Tracks learned signs and quiz scores, persisted with `AsyncStorage`.   |

---

## Prerequisites

- **Node.js 18+** and npm
- **Python 3.10+**
- **[Ollama](https://ollama.com/)** installed locally

---

## 1. Set up Ollama

Install Ollama, then pull and run the model:

```bash
# Pull the model (one-time)
ollama pull llama3

# Ollama runs a server on http://localhost:11434 automatically.
# Verify it's up:
curl http://localhost:11434/api/tags
```

> Prefer Mistral? Run `ollama pull mistral` and start the backend with
> `OLLAMA_MODEL=mistral`.

---

## 2. Run the FastAPI backend

```bash
cd backend

# Create and activate a virtual environment
python -m venv .venv
# Windows (PowerShell):
.venv\Scripts\Activate.ps1
# macOS/Linux:
# source .venv/bin/activate

pip install -r requirements.txt

# Start the API (http://localhost:8000)
uvicorn main:app --reload --port 8000
```

Quick checks:

```bash
curl http://localhost:8000/health
curl http://localhost:8000/api/signs
```

### Backend endpoints

| Method | Path          | Body                  | Description                                   |
|--------|---------------|-----------------------|-----------------------------------------------|
| GET    | `/api/signs`  | —                     | Full sign dictionary from `signs.json`.       |
| POST   | `/api/chat`   | `{ "message": str }`  | Streams an ASL tutor reply (`text/plain`).    |
| POST   | `/api/quiz`   | `{ "sign": str }`     | Returns a generated multiple-choice question. |

### Configuration (env vars)

| Variable        | Default                   | Purpose                       |
|-----------------|---------------------------|-------------------------------|
| `OLLAMA_HOST`   | `http://localhost:11434`  | Ollama server URL.            |
| `OLLAMA_MODEL`  | `llama3`                  | Model name to use.            |
| `CORS_ORIGINS`  | localhost dev origins     | Comma-separated CORS origins. |

---

## 3. Run the Expo app

```bash
cd app
npm install

# Start the dev server, then choose a platform:
npm run web        # browser
npm run android    # Android emulator/device
npm run ios        # iOS simulator (macOS only)
# or just:
npm start
```

### Pointing the app at the backend

The app auto-detects the backend URL:

- **Web / iOS simulator** → `http://localhost:8000`
- **Android emulator** → `http://10.0.2.2:8000`

For a **physical device**, copy `.env.example` to `.env` and set your machine's
LAN IP:

```
EXPO_PUBLIC_API_URL=http://192.168.1.50:8000
```

Then restart `npm start`.

---

## Typical dev workflow

Open three terminals:

1. `ollama serve` (usually already running after install)
2. `cd backend && uvicorn main:app --reload --port 8000`
3. `cd app && npm start`

---

## Tech stack

- **Frontend:** Expo, React Native, TypeScript, expo-router, AsyncStorage
- **Backend:** FastAPI, Uvicorn, httpx
- **LLM:** Ollama (`llama3` / `mistral`)

## Notes

- Sign GIFs are linked from public sources for demo purposes. Swap the `image`
  URLs in [`backend/signs.json`](backend/signs.json) for your own assets in
  production.
- The tutor system prompt lives in [`backend/config.py`](backend/config.py).

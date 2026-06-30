# Run the Code — Manuō (ASL Learning App)

This guide walks you through running the app on a fresh machine. The project has
two parts that run together:

- **`backend/`** — a FastAPI server that serves sign data and proxies a local
  **Ollama** model (powers the AI Tutor + Quiz).
- **`app/`** — the Expo / React Native frontend (run in the browser).

You'll have **three things running**: Ollama, the backend, and the Expo dev
server.

---

## 1. Install prerequisites (one-time)

| Tool | Version | Download | Used for |
|------|---------|----------|----------|
| **Node.js** | 18 or newer (includes npm) | https://nodejs.org/ | Running the Expo app |
| **Python** | 3.10 or newer | https://www.python.org/downloads/ | Running the backend |
| **Git** | any recent | https://git-scm.com/downloads | Cloning the repo |
| **Ollama** | latest | https://ollama.com/download | Local LLM for AI Tutor + Quiz |

Verify each is installed (open a new terminal):

```powershell
node --version
npm --version
python --version
git --version
ollama --version
```

---

## 2. Clone the repository

```powershell
git clone https://github.com/Boredletsgo/Manu-.git
cd Manu-
```

---

## 3. Start Ollama and pull a model

Ollama automatically runs a server on `http://localhost:11434` after install.
Pull the model the backend expects:

```powershell
ollama pull llama3
```

> **Lighter alternative** (what this project was developed against):
> `ollama pull llama3.2:3b`. If you use it, set the model when starting the
> backend (see step 4).

Verify Ollama is up:

```powershell
curl http://localhost:11434/api/tags
```

---

## 4. Run the backend (Terminal 1)

```powershell
cd backend

# Create and activate a virtual environment
python -m venv .venv
.venv\Scripts\Activate.ps1          # Windows (PowerShell)
# source .venv/bin/activate          # macOS / Linux

# Install dependencies
pip install -r requirements.txt

# (Optional) use the lighter model
# $env:OLLAMA_MODEL = "llama3.2:3b"   # Windows
# export OLLAMA_MODEL=llama3.2:3b      # macOS / Linux

# Start the API on http://localhost:8000
uvicorn main:app --reload --port 8000
```

Verify it works — open <http://localhost:8000/api/signs> in a browser; you
should see JSON.

### Backend environment variables (optional)

| Variable | Default | Purpose |
|----------|---------|---------|
| `OLLAMA_HOST` | `http://localhost:11434` | Ollama server URL |
| `OLLAMA_MODEL` | `llama3` | Model name to use |
| `CORS_ORIGINS` | localhost dev origins | Comma-separated allowed origins |

---

## 5. Run the app (Terminal 2)

```powershell
cd app
npm install
npm run web
```

Open the URL it prints (usually <http://localhost:8081>).

---

## How the app finds the backend

The app reads `EXPO_PUBLIC_API_URL`. With **no `.env` file** it defaults to
`http://localhost:8000`, which matches the backend port above — so **no extra
config is needed** if you use port 8000.

To use a different port, copy the example env file and set the URL:

```powershell
# from the app/ folder
copy .env.example .env      # Windows
# cp .env.example .env        # macOS / Linux
# then edit .env:
# EXPO_PUBLIC_API_URL=http://localhost:8001
```

Restart `npm run web` after changing `.env`.

---

## Quick recap (three terminals)

1. **Ollama** — runs automatically after install (`ollama serve` if needed).
2. **Backend** — `cd backend` → activate venv → `uvicorn main:app --reload --port 8000`
3. **App** — `cd app` → `npm run web`

---

## Notes & troubleshooting

- **Run all three.** The Learn tab needs the backend; AI Tutor and Quiz also
  need Ollama running.
- **Use the web target** (`npm run web`). The logo, brand mark, and fonts load
  via web CSS, so they appear in the browser. Native (Android/iOS) builds won't
  resolve those assets without extra setup.
- **Port already in use?** Start the backend on another port
  (`uvicorn main:app --reload --port 8001`) and set
  `EXPO_PUBLIC_API_URL=http://localhost:8001` in `app/.env`.
- **AI Tutor/Quiz not responding?** Confirm Ollama is running
  (`curl http://localhost:11434/api/tags`) and that you pulled the model
  (`ollama pull llama3`).
- **macOS / Linux:** identical steps; activate the venv with
  `source .venv/bin/activate`.

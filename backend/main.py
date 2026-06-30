"""FastAPI server for the ASL learning app.

Exposes three endpoints:
  GET  /api/signs  -> full sign dictionary from signs.json
  POST /api/chat   -> streams an ASL tutor reply from Ollama
  POST /api/quiz   -> generates a quiz question for a given sign via Ollama
"""
from __future__ import annotations

import json
import re
from pathlib import Path

import httpx
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import StreamingResponse
from pydantic import BaseModel, Field

import ollama_client
from config import CORS_ORIGINS, OLLAMA_MODEL

app = FastAPI(title="ASL Learning API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

SIGNS_PATH = Path(__file__).parent / "signs.json"


# ---------------------------------------------------------------------------
# Models
# ---------------------------------------------------------------------------
class ChatRequest(BaseModel):
    message: str = Field(..., min_length=1, max_length=2000)


class QuizRequest(BaseModel):
    sign: str = Field(..., min_length=1, max_length=100)


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------
def load_signs() -> list[dict]:
    if not SIGNS_PATH.exists():
        raise HTTPException(status_code=500, detail="signs.json not found")
    with SIGNS_PATH.open("r", encoding="utf-8") as f:
        return json.load(f)


# ---------------------------------------------------------------------------
# Routes
# ---------------------------------------------------------------------------
@app.get("/health")
async def health() -> dict:
    return {"status": "ok", "model": OLLAMA_MODEL}


@app.get("/api/signs")
async def get_signs() -> list[dict]:
    """Return the full ASL sign dictionary."""
    return load_signs()


@app.post("/api/chat")
async def chat(req: ChatRequest) -> StreamingResponse:
    """Stream an ASL tutor response from Ollama back to the client."""

    async def event_stream():
        try:
            async for chunk in ollama_client.stream_chat(req.message):
                yield chunk
        except httpx.HTTPError as exc:
            yield f"\n[Error contacting Ollama: {exc}]"

    return StreamingResponse(event_stream(), media_type="text/plain")


@app.post("/api/quiz")
async def quiz(req: QuizRequest) -> dict:
    """Generate a multiple-choice quiz question for the given sign."""
    prompt = (
        f"Create one multiple-choice quiz question about the ASL sign for "
        f'"{req.sign}". Respond ONLY with valid JSON in exactly this shape:\n'
        '{"question": "...", "options": ["...", "...", "...", "..."], '
        '"answer": "...", "explanation": "..."}\n'
        "The answer must be one of the options. Keep it beginner friendly."
    )

    try:
        raw = await ollama_client.generate(prompt)
    except httpx.HTTPError as exc:
        raise HTTPException(status_code=502, detail=f"Ollama error: {exc}") from exc

    # Extract the first JSON object from the model output.
    match = re.search(r"\{.*\}", raw, re.DOTALL)
    if match:
        try:
            return json.loads(match.group(0))
        except json.JSONDecodeError:
            pass

    # Fallback if the model didn't return clean JSON.
    return {
        "question": f"What is the ASL sign for '{req.sign}'?",
        "options": [req.sign, "Hello", "Thank you", "Please"],
        "answer": req.sign,
        "explanation": raw.strip() or "Review the handshape and movement.",
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)

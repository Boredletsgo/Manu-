"""Thin async client around the Ollama REST API.

Provides streaming chat generation and a one-shot generation helper used by
the quiz endpoint. The backend never talks to Ollama anywhere else, so all
model interaction is centralized here.
"""
from __future__ import annotations

import json
from typing import AsyncGenerator

import httpx

from config import OLLAMA_HOST, OLLAMA_MODEL, ASL_SYSTEM_PROMPT


async def stream_chat(message: str) -> AsyncGenerator[str, None]:
    """Stream a chat completion from Ollama as plain text chunks.

    Yields the incremental `response` tokens produced by Ollama's
    `/api/generate` streaming endpoint.
    """
    payload = {
        "model": OLLAMA_MODEL,
        "system": ASL_SYSTEM_PROMPT,
        "prompt": message,
        "stream": True,
    }

    timeout = httpx.Timeout(connect=10.0, read=None, write=10.0, pool=10.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        async with client.stream(
            "POST", f"{OLLAMA_HOST}/api/generate", json=payload
        ) as response:
            response.raise_for_status()
            async for line in response.aiter_lines():
                if not line.strip():
                    continue
                try:
                    data = json.loads(line)
                except json.JSONDecodeError:
                    continue
                chunk = data.get("response", "")
                if chunk:
                    yield chunk
                if data.get("done"):
                    break


async def generate(prompt: str, system: str | None = None) -> str:
    """Return a single, non-streamed completion from Ollama."""
    payload = {
        "model": OLLAMA_MODEL,
        "system": system or ASL_SYSTEM_PROMPT,
        "prompt": prompt,
        "stream": False,
    }

    timeout = httpx.Timeout(connect=10.0, read=120.0, write=10.0, pool=10.0)
    async with httpx.AsyncClient(timeout=timeout) as client:
        response = await client.post(f"{OLLAMA_HOST}/api/generate", json=payload)
        response.raise_for_status()
        data = response.json()
        return data.get("response", "")

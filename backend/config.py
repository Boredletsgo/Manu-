"""Configuration for the ASL backend."""
import os

# Ollama settings
OLLAMA_HOST = os.getenv("OLLAMA_HOST", "http://localhost:11434")
OLLAMA_MODEL = os.getenv("OLLAMA_MODEL", "llama3")

# ASL tutor system prompt used for every chat / quiz interaction.
ASL_SYSTEM_PROMPT = (
    "You are an expert ASL (American Sign Language) tutor. "
    "Help learners understand signs, handshapes, grammar, and Deaf culture. "
    "Be concise and encouraging."
)

# CORS origins allowed during local development.
CORS_ORIGINS = os.getenv(
    "CORS_ORIGINS",
    "http://localhost:8081,http://localhost:19006,http://localhost:3000,*",
).split(",")

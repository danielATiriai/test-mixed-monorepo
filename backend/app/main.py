import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, text

app = FastAPI(title="test-mixed-monorepo backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL", "")


def get_db_status() -> str:
    if not DATABASE_URL:
        return "no DATABASE_URL configured"
    try:
        engine = create_engine(DATABASE_URL)
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        return "connected"
    except Exception as e:
        return f"error: {str(e)}"


@app.get("/")
async def root():
    return {
        "service": "test-mixed-monorepo backend",
        "builder": "docker",
        "status": "ok",
    }


@app.get("/health")
async def health():
    return {"status": "healthy"}


@app.get("/api/items")
async def get_items():
    db_status = get_db_status()
    return {
        "items": [
            {"id": 1, "name": "Item One", "description": "First item"},
            {"id": 2, "name": "Item Two", "description": "Second item"},
            {"id": 3, "name": "Item Three", "description": "Third item"},
        ],
        "database": db_status,
    }

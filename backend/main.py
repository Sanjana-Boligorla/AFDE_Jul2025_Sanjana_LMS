"""
main.py
-------
FastAPI application entry point.
Run with:  uvicorn main:app --reload --port 8000
Docs at:   http://localhost:8000/docs
"""

from fastapi import FastAPI, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session

import crud
import schemas
from database import engine, get_db, Base
from routers import books, borrowers, transactions, search

# ── Create all tables (if they don't already exist) ───────────────────────────
# Note: The preferred approach is to run database/schema.sql manually in MySQL.
# This line is a fallback to auto-create tables via SQLAlchemy.
Base.metadata.create_all(bind=engine)

# ── Application instance ──────────────────────────────────────────────────────
app = FastAPI(
    title       = "Library Management System API",
    description = "REST API for managing books, borrowers, and transactions.",
    version     = "1.0.0",
    docs_url    = "/docs",
    redoc_url   = "/redoc",
)

# ── CORS ──────────────────────────────────────────────────────────────────────
# Allow the React dev server (port 5173 via Vite) to communicate with the API.
app.add_middleware(
    CORSMiddleware,
    allow_origins     = ["http://localhost:5173", "http://localhost:3000"],
    allow_credentials = True,
    allow_methods     = ["*"],
    allow_headers     = ["*"],
)

# ── Include routers ───────────────────────────────────────────────────────────
app.include_router(books.router)
app.include_router(borrowers.router)
app.include_router(transactions.router)
app.include_router(search.router)


# ── Health check ─────────────────────────────────────────────────────────────
@app.get("/", tags=["Health"])
def root():
    return {"status": "ok", "message": "Library Management System API is running."}


# ── Dashboard stats ───────────────────────────────────────────────────────────
@app.get("/dashboard", response_model=schemas.DashboardStats, tags=["Dashboard"])
def dashboard(db: Session = Depends(get_db)):
    """Return aggregated stats for the dashboard page."""
    return crud.get_dashboard_stats(db)

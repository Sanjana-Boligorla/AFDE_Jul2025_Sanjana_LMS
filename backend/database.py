"""
database.py
-----------
SQLAlchemy engine and session configuration for MySQL (pymysql driver).
"""

from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

# ── Connection string ────────────────────────────────────────────────────────
# Format: mysql+pymysql://<user>:<password>@<host>:<port>/<database>
DATABASE_URL = "mysql+pymysql://root:root@localhost:3306/lms_db"

# ── Engine ────────────────────────────────────────────────────────────────────
engine = create_engine(
    DATABASE_URL,
    pool_pre_ping=True,       # auto-reconnect on stale connections
    pool_size=10,
    max_overflow=20,
    echo=False,               # set True to log all SQL (useful for debugging)
)

# ── Session factory ───────────────────────────────────────────────────────────
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# ── Base class for ORM models ─────────────────────────────────────────────────
Base = declarative_base()


# ── Dependency for FastAPI routes ─────────────────────────────────────────────
def get_db():
    """
    Yield a database session and ensure it is closed after the request.
    Use as a FastAPI dependency: db: Session = Depends(get_db)
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

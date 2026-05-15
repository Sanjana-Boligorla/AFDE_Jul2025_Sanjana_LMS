"""
routers/search.py
-----------------
Search endpoint — keyword, category, and author filters.
"""

from typing import List, Optional

from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db

router = APIRouter(tags=["Search"])


@router.get("/search", response_model=List[schemas.BookResponse])
def search_books(
    query:    Optional[str] = Query(None, description="Keyword — matches title, author, or ISBN"),
    category: Optional[str] = Query(None, description="Filter by category"),
    author:   Optional[str] = Query(None, description="Filter by author"),
    db: Session = Depends(get_db),
):
    """
    Search books by keyword, category, or author.
    Supports partial / case-insensitive matching.
    All parameters are optional and combinable.
    """
    return crud.search_books(db, query=query, category=category, author=author)

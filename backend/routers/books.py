"""
routers/books.py
----------------
Book management endpoints — full CRUD.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db

router = APIRouter(prefix="/books", tags=["Books"])


@router.get("/", response_model=List[schemas.BookResponse])
def list_books(db: Session = Depends(get_db)):
    """Retrieve all books."""
    return crud.get_all_books(db)


@router.get("/{book_id}", response_model=schemas.BookResponse)
def get_book(book_id: int, db: Session = Depends(get_db)):
    """Retrieve a single book by ID."""
    book = crud.get_book_by_id(db, book_id)
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with id {book_id} not found.",
        )
    return book


@router.post("/", response_model=schemas.BookResponse, status_code=status.HTTP_201_CREATED)
def add_book(payload: schemas.BookCreate, db: Session = Depends(get_db)):
    """Add a new book. ISBN must be unique."""
    if crud.get_book_by_isbn(db, payload.isbn):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A book with ISBN '{payload.isbn}' already exists.",
        )
    return crud.create_book(db, payload)


@router.put("/{book_id}", response_model=schemas.BookResponse)
def edit_book(book_id: int, payload: schemas.BookUpdate, db: Session = Depends(get_db)):
    """Update book details. Only supplied fields are changed."""
    # If ISBN is being changed, ensure no duplicate
    if payload.isbn:
        existing = crud.get_book_by_isbn(db, payload.isbn)
        if existing and existing.book_id != book_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"A book with ISBN '{payload.isbn}' already exists.",
            )
    book = crud.update_book(db, book_id, payload)
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with id {book_id} not found.",
        )
    return book


@router.delete("/{book_id}", status_code=status.HTTP_200_OK)
def remove_book(book_id: int, db: Session = Depends(get_db)):
    """Delete a book. Fails if the book is currently borrowed."""
    book = crud.get_book_by_id(db, book_id)
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with id {book_id} not found.",
        )
    if book.availability_status == "Borrowed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a book that is currently borrowed.",
        )
    crud.delete_book(db, book_id)
    return {"success": True, "message": f"Book '{book.title}' deleted successfully."}

"""
routers/borrowers.py
--------------------
Borrower management endpoints — full CRUD.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db

router = APIRouter(prefix="/borrowers", tags=["Borrowers"])


@router.get("/", response_model=List[schemas.BorrowerResponse])
def list_borrowers(db: Session = Depends(get_db)):
    """Retrieve all borrowers."""
    return crud.get_all_borrowers(db)


@router.get("/{borrower_id}", response_model=schemas.BorrowerResponse)
def get_borrower(borrower_id: int, db: Session = Depends(get_db)):
    """Retrieve a single borrower by ID."""
    borrower = crud.get_borrower_by_id(db, borrower_id)
    if not borrower:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Borrower with id {borrower_id} not found.",
        )
    return borrower


@router.post("/", response_model=schemas.BorrowerResponse, status_code=status.HTTP_201_CREATED)
def add_borrower(payload: schemas.BorrowerCreate, db: Session = Depends(get_db)):
    """Register a new borrower. Email must be unique."""
    if crud.get_borrower_by_email(db, payload.email):
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"A borrower with email '{payload.email}' already exists.",
        )
    return crud.create_borrower(db, payload)


@router.put("/{borrower_id}", response_model=schemas.BorrowerResponse)
def edit_borrower(
    borrower_id: int, payload: schemas.BorrowerUpdate, db: Session = Depends(get_db)
):
    """Update borrower details. Only supplied fields are changed."""
    if payload.email:
        existing = crud.get_borrower_by_email(db, payload.email)
        if existing and existing.borrower_id != borrower_id:
            raise HTTPException(
                status_code=status.HTTP_409_CONFLICT,
                detail=f"A borrower with email '{payload.email}' already exists.",
            )
    borrower = crud.update_borrower(db, borrower_id, payload)
    if not borrower:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Borrower with id {borrower_id} not found.",
        )
    return borrower


@router.delete("/{borrower_id}", status_code=status.HTTP_200_OK)
def remove_borrower(borrower_id: int, db: Session = Depends(get_db)):
    """Delete a borrower. Fails if the borrower has active borrows."""
    borrower = crud.get_borrower_by_id(db, borrower_id)
    if not borrower:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Borrower with id {borrower_id} not found.",
        )
    # Block deletion if there are active transactions
    active = any(t.status == "Borrowed" for t in borrower.transactions)
    if active:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Cannot delete a borrower with active book borrowings.",
        )
    crud.delete_borrower(db, borrower_id)
    return {
        "success": True,
        "message": f"Borrower '{borrower.borrower_name}' deleted successfully.",
    }

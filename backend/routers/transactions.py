"""
routers/transactions.py
-----------------------
Borrow / Return endpoints and transaction history.
"""

from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

import crud
import schemas
from database import get_db

router = APIRouter(tags=["Transactions"])


def _format_transaction(t) -> schemas.TransactionResponse:
    """Map ORM Transaction (with joined relations) → TransactionResponse."""
    return schemas.TransactionResponse(
        transaction_id = t.transaction_id,
        book_id        = t.book_id,
        borrower_id    = t.borrower_id,
        borrow_date    = t.borrow_date,
        return_date    = t.return_date,
        status         = t.status,
        book_title     = t.book.title     if t.book     else None,
        book_isbn      = t.book.isbn      if t.book     else None,
        borrower_name  = t.borrower.borrower_name if t.borrower else None,
        borrower_email = t.borrower.email          if t.borrower else None,
    )


@router.get("/transactions", response_model=List[schemas.TransactionResponse])
def list_transactions(db: Session = Depends(get_db)):
    """Retrieve all borrow/return transactions."""
    transactions = crud.get_all_transactions(db)
    return [_format_transaction(t) for t in transactions]


@router.post("/borrow", response_model=schemas.TransactionResponse, status_code=status.HTTP_201_CREATED)
def borrow_book(payload: schemas.BorrowRequest, db: Session = Depends(get_db)):
    """
    Borrow an available book.
    - Validates book exists and is Available.
    - Validates borrower exists.
    - Creates a transaction and marks the book as Borrowed.
    """
    book = crud.get_book_by_id(db, payload.book_id)
    if not book:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Book with id {payload.book_id} not found.",
        )
    if book.availability_status != "Available":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Book '{book.title}' is not available for borrowing.",
        )

    borrower = crud.get_borrower_by_id(db, payload.borrower_id)
    if not borrower:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Borrower with id {payload.borrower_id} not found.",
        )

    transaction = crud.borrow_book(db, payload)
    return _format_transaction(transaction)


@router.post("/return", response_model=schemas.TransactionResponse)
def return_book(payload: schemas.ReturnRequest, db: Session = Depends(get_db)):
    """
    Return a borrowed book.
    - Validates transaction exists and is still open (status = Borrowed).
    - Sets return_date, marks transaction Returned, marks book Available.
    """
    existing = crud.get_transaction_by_id(db, payload.transaction_id)
    if not existing:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Transaction with id {payload.transaction_id} not found.",
        )
    if existing.status == "Returned":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="This book has already been returned.",
        )

    transaction = crud.return_book(db, payload)
    return _format_transaction(transaction)

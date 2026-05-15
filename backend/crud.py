"""
crud.py
-------
All database operations — Create, Read, Update, Delete.
Routers call these functions; they never touch the DB directly.
"""

from datetime import datetime
from typing import List, Optional

from sqlalchemy.orm import Session, joinedload

import models
import schemas


# ══════════════════════════════════════════════════════════════════════════════
#  BOOK operations
# ══════════════════════════════════════════════════════════════════════════════

def get_all_books(db: Session) -> List[models.Book]:
    return db.query(models.Book).order_by(models.Book.created_at.desc()).all()


def get_book_by_id(db: Session, book_id: int) -> Optional[models.Book]:
    return db.query(models.Book).filter(models.Book.book_id == book_id).first()


def get_book_by_isbn(db: Session, isbn: str) -> Optional[models.Book]:
    return db.query(models.Book).filter(models.Book.isbn == isbn).first()


def create_book(db: Session, payload: schemas.BookCreate) -> models.Book:
    book = models.Book(
        title               = payload.title,
        author              = payload.author,
        category            = payload.category,
        isbn                = payload.isbn,
        availability_status = "Available",
    )
    db.add(book)
    db.commit()
    db.refresh(book)
    return book


def update_book(
    db: Session, book_id: int, payload: schemas.BookUpdate
) -> Optional[models.Book]:
    book = get_book_by_id(db, book_id)
    if not book:
        return None
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(book, field, value)
    db.commit()
    db.refresh(book)
    return book


def delete_book(db: Session, book_id: int) -> bool:
    book = get_book_by_id(db, book_id)
    if not book:
        return False
    db.delete(book)
    db.commit()
    return True


# ══════════════════════════════════════════════════════════════════════════════
#  BORROWER operations
# ══════════════════════════════════════════════════════════════════════════════

def get_all_borrowers(db: Session) -> List[models.Borrower]:
    return db.query(models.Borrower).order_by(models.Borrower.created_at.desc()).all()


def get_borrower_by_id(db: Session, borrower_id: int) -> Optional[models.Borrower]:
    return (
        db.query(models.Borrower)
        .filter(models.Borrower.borrower_id == borrower_id)
        .first()
    )


def get_borrower_by_email(db: Session, email: str) -> Optional[models.Borrower]:
    return (
        db.query(models.Borrower)
        .filter(models.Borrower.email == email)
        .first()
    )


def create_borrower(db: Session, payload: schemas.BorrowerCreate) -> models.Borrower:
    borrower = models.Borrower(
        borrower_name = payload.borrower_name,
        email         = payload.email,
        phone         = payload.phone,
    )
    db.add(borrower)
    db.commit()
    db.refresh(borrower)
    return borrower


def update_borrower(
    db: Session, borrower_id: int, payload: schemas.BorrowerUpdate
) -> Optional[models.Borrower]:
    borrower = get_borrower_by_id(db, borrower_id)
    if not borrower:
        return None
    update_data = payload.model_dump(exclude_unset=True)
    for field, value in update_data.items():
        setattr(borrower, field, value)
    db.commit()
    db.refresh(borrower)
    return borrower


def delete_borrower(db: Session, borrower_id: int) -> bool:
    borrower = get_borrower_by_id(db, borrower_id)
    if not borrower:
        return False
    db.delete(borrower)
    db.commit()
    return True


# ══════════════════════════════════════════════════════════════════════════════
#  TRANSACTION operations
# ══════════════════════════════════════════════════════════════════════════════

def get_all_transactions(db: Session) -> List[models.Transaction]:
    return (
        db.query(models.Transaction)
        .options(
            joinedload(models.Transaction.book),
            joinedload(models.Transaction.borrower),
        )
        .order_by(models.Transaction.borrow_date.desc())
        .all()
    )


def get_transaction_by_id(db: Session, transaction_id: int) -> Optional[models.Transaction]:
    return (
        db.query(models.Transaction)
        .options(
            joinedload(models.Transaction.book),
            joinedload(models.Transaction.borrower),
        )
        .filter(models.Transaction.transaction_id == transaction_id)
        .first()
    )


def get_active_transaction_for_book(db: Session, book_id: int) -> Optional[models.Transaction]:
    """Return the open (Borrowed) transaction for a book, if any."""
    return (
        db.query(models.Transaction)
        .filter(
            models.Transaction.book_id == book_id,
            models.Transaction.status  == "Borrowed",
        )
        .first()
    )


def borrow_book(
    db: Session, payload: schemas.BorrowRequest
) -> models.Transaction:
    """Create a borrow transaction and mark the book as Borrowed."""
    transaction = models.Transaction(
        book_id     = payload.book_id,
        borrower_id = payload.borrower_id,
        status      = "Borrowed",
    )
    db.add(transaction)

    # Update book availability
    book = get_book_by_id(db, payload.book_id)
    book.availability_status = "Borrowed"

    db.commit()
    db.refresh(transaction)

    # Reload with relationships
    return get_transaction_by_id(db, transaction.transaction_id)


def return_book(
    db: Session, payload: schemas.ReturnRequest
) -> Optional[models.Transaction]:
    """Close a borrow transaction and mark the book as Available."""
    transaction = get_transaction_by_id(db, payload.transaction_id)
    if not transaction or transaction.status == "Returned":
        return None

    transaction.return_date = datetime.utcnow()
    transaction.status      = "Returned"

    # Mark book available again
    book = get_book_by_id(db, transaction.book_id)
    book.availability_status = "Available"

    db.commit()
    db.refresh(transaction)
    return transaction


# ══════════════════════════════════════════════════════════════════════════════
#  SEARCH operations
# ══════════════════════════════════════════════════════════════════════════════

def search_books(
    db: Session,
    query:    Optional[str] = None,
    category: Optional[str] = None,
    author:   Optional[str] = None,
) -> List[models.Book]:
    q = db.query(models.Book)

    if query:
        keyword = f"%{query}%"
        q = q.filter(
            models.Book.title.ilike(keyword)
            | models.Book.author.ilike(keyword)
            | models.Book.isbn.ilike(keyword)
        )

    if category:
        q = q.filter(models.Book.category.ilike(f"%{category}%"))

    if author:
        q = q.filter(models.Book.author.ilike(f"%{author}%"))

    return q.order_by(models.Book.title).all()


# ══════════════════════════════════════════════════════════════════════════════
#  DASHBOARD stats
# ══════════════════════════════════════════════════════════════════════════════

def get_dashboard_stats(db: Session) -> schemas.DashboardStats:
    total_books     = db.query(models.Book).count()
    available_books = db.query(models.Book).filter(
        models.Book.availability_status == "Available"
    ).count()
    borrowed_books  = db.query(models.Book).filter(
        models.Book.availability_status == "Borrowed"
    ).count()
    total_borrowers    = db.query(models.Borrower).count()
    total_transactions = db.query(models.Transaction).count()

    return schemas.DashboardStats(
        total_books        = total_books,
        available_books    = available_books,
        borrowed_books     = borrowed_books,
        total_borrowers    = total_borrowers,
        total_transactions = total_transactions,
    )

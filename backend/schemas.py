"""
schemas.py
----------
Pydantic models for request validation and response serialisation.
"""

from __future__ import annotations

from datetime import datetime
from typing import Literal, Optional

from pydantic import BaseModel, EmailStr, field_validator


# ══════════════════════════════════════════════════════════════════════════════
#  BOOK schemas
# ══════════════════════════════════════════════════════════════════════════════

class BookBase(BaseModel):
    title:    str
    author:   str
    category: str
    isbn:     str

    @field_validator("title", "author", "category", "isbn")
    @classmethod
    def must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field must not be blank")
        return v.strip()


class BookCreate(BookBase):
    """Payload for POST /books"""
    pass


class BookUpdate(BaseModel):
    """Payload for PUT /books/{id} — all fields optional"""
    title:               Optional[str] = None
    author:              Optional[str] = None
    category:            Optional[str] = None
    isbn:                Optional[str] = None
    availability_status: Optional[Literal["Available", "Borrowed"]] = None


class BookResponse(BookBase):
    book_id:             int
    availability_status: Literal["Available", "Borrowed"]
    created_at:          datetime
    updated_at:          datetime

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════════════════════════════════════════
#  BORROWER schemas
# ══════════════════════════════════════════════════════════════════════════════

class BorrowerBase(BaseModel):
    borrower_name: str
    email:         EmailStr
    phone:         str

    @field_validator("borrower_name", "phone")
    @classmethod
    def must_not_be_blank(cls, v: str) -> str:
        if not v.strip():
            raise ValueError("Field must not be blank")
        return v.strip()


class BorrowerCreate(BorrowerBase):
    """Payload for POST /borrowers"""
    pass


class BorrowerUpdate(BaseModel):
    """Payload for PUT /borrowers/{id} — all fields optional"""
    borrower_name: Optional[str]      = None
    email:         Optional[EmailStr] = None
    phone:         Optional[str]      = None


class BorrowerResponse(BorrowerBase):
    borrower_id: int
    created_at:  datetime
    updated_at:  datetime

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════════════════════════════════════════
#  TRANSACTION schemas
# ══════════════════════════════════════════════════════════════════════════════

class BorrowRequest(BaseModel):
    """Payload for POST /borrow"""
    book_id:     int
    borrower_id: int


class ReturnRequest(BaseModel):
    """Payload for POST /return"""
    transaction_id: int


class TransactionResponse(BaseModel):
    transaction_id: int
    book_id:        int
    borrower_id:    int
    borrow_date:    datetime
    return_date:    Optional[datetime]
    status:         Literal["Borrowed", "Returned"]

    # Nested info for richer frontend display
    book_title:     Optional[str] = None
    book_isbn:      Optional[str] = None
    borrower_name:  Optional[str] = None
    borrower_email: Optional[str] = None

    model_config = {"from_attributes": True}


# ══════════════════════════════════════════════════════════════════════════════
#  DASHBOARD / STATS schema
# ══════════════════════════════════════════════════════════════════════════════

class DashboardStats(BaseModel):
    total_books:        int
    available_books:    int
    borrowed_books:     int
    total_borrowers:    int
    total_transactions: int


# ══════════════════════════════════════════════════════════════════════════════
#  Generic API Response wrapper
# ══════════════════════════════════════════════════════════════════════════════

class APIResponse(BaseModel):
    success: bool
    message: str
    data:    Optional[object] = None

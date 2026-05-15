"""
models.py
---------
SQLAlchemy ORM models — one class per database table.
"""

from sqlalchemy import Column, Integer, String, Enum, DateTime, ForeignKey, func
from sqlalchemy.orm import relationship

from database import Base


class Book(Base):
    __tablename__ = "books"

    book_id             = Column(Integer, primary_key=True, index=True, autoincrement=True)
    title               = Column(String(255), nullable=False)
    author              = Column(String(255), nullable=False)
    category            = Column(String(100), nullable=False)
    isbn                = Column(String(50),  nullable=False, unique=True, index=True)
    availability_status = Column(
        Enum("Available", "Borrowed"),
        nullable=False,
        default="Available",
        server_default="Available",
    )
    created_at = Column(DateTime, nullable=False, server_default=func.now())
    updated_at = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationship — one book can appear in many transactions
    transactions = relationship("Transaction", back_populates="book")


class Borrower(Base):
    __tablename__ = "borrowers"

    borrower_id   = Column(Integer, primary_key=True, index=True, autoincrement=True)
    borrower_name = Column(String(255), nullable=False)
    email         = Column(String(255), nullable=False, unique=True, index=True)
    phone         = Column(String(20),  nullable=False)
    created_at    = Column(DateTime, nullable=False, server_default=func.now())
    updated_at    = Column(DateTime, nullable=False, server_default=func.now(), onupdate=func.now())

    # Relationship — one borrower can have many transactions
    transactions = relationship("Transaction", back_populates="borrower")


class Transaction(Base):
    __tablename__ = "transactions"

    transaction_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    book_id        = Column(Integer, ForeignKey("books.book_id"),         nullable=False)
    borrower_id    = Column(Integer, ForeignKey("borrowers.borrower_id"), nullable=False)
    borrow_date    = Column(DateTime, nullable=False, server_default=func.now())
    return_date    = Column(DateTime, nullable=True)
    status         = Column(
        Enum("Borrowed", "Returned"),
        nullable=False,
        default="Borrowed",
        server_default="Borrowed",
    )

    # Relationships
    book     = relationship("Book",     back_populates="transactions")
    borrower = relationship("Borrower", back_populates="transactions")

# 📚 Library Management System

**AFDE_Jul2025_Sanjana_LMS** — Capstone Project Phase 1

A full-stack web application for managing library books, borrowers, and borrow/return transactions — built with React, FastAPI, and MySQL.

---

## Project Overview

Libraries often manage books and borrower records manually using notebooks and spreadsheets. This system digitises and streamlines library operations through a centralised web application, enabling librarians to manage books, track borrowers, record transactions, and search the catalogue efficiently.

---

## Features

| Feature | Description |
|---|---|
| 📊 Dashboard | Live stats — total books, available, borrowed, and recent transactions |
| 📖 Book Management | Add, edit, delete, and view books with availability tracking |
| 👥 Borrower Management | Register, edit, and remove borrowers |
| 🔄 Borrow & Return | Issue books to borrowers and process returns with one click |
| 📋 Transactions | Full history of all borrow/return activity with duration tracking |
| 🔍 Search | Live search across title, author, ISBN with category and author filters |

---

## Technology Stack

| Layer | Technology |
|---|---|
| Frontend | React 18 (Vite) + Tailwind CSS |
| Backend | Python FastAPI |
| Database | MySQL 8.x |
| ORM | SQLAlchemy 2.0 |
| Validation | Pydantic v2 |
| HTTP Client | Axios |
| Icons | Lucide React |
| Notifications | React Hot Toast |
| Version Control | Git / GitHub |

---

## Project Structure

```
AFDE_Jul2025_Sanjana_LMS/
│
├── backend/
│   ├── main.py                  # FastAPI app + CORS + route registration
│   ├── database.py              # MySQL engine, session factory, Base
│   ├── models.py                # SQLAlchemy ORM models (Book, Borrower, Transaction)
│   ├── schemas.py               # Pydantic request/response models
│   ├── crud.py                  # All DB operations (separated from routing)
│   ├── routers/
│   │   ├── books.py             # GET/POST/PUT/DELETE /books
│   │   ├── borrowers.py         # GET/POST/PUT/DELETE /borrowers
│   │   ├── transactions.py      # POST /borrow, POST /return, GET /transactions
│   │   └── search.py            # GET /search
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   │   └── favicon.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout.jsx       # Sidebar + Navbar wrapper
│   │   │   ├── Sidebar.jsx      # Fixed navigation sidebar
│   │   │   ├── Navbar.jsx       # Top header with page title
│   │   │   ├── Modal.jsx        # Reusable modal overlay
│   │   │   ├── ConfirmModal.jsx # Destructive action confirmation dialog
│   │   │   ├── StatusBadge.jsx  # Available / Borrowed / Returned pills
│   │   │   └── LoadingSpinner.jsx
│   │   ├── pages/
│   │   │   ├── Dashboard.jsx    # Stats cards + recent transactions
│   │   │   ├── Books.jsx        # Book CRUD with modals + inline search
│   │   │   ├── Borrowers.jsx    # Borrower CRUD with avatar initials
│   │   │   ├── BorrowReturn.jsx # Borrow form + active borrows table
│   │   │   ├── Transactions.jsx # Full history with filter tabs
│   │   │   ├── Search.jsx       # Live search with category/author filters
│   │   │   └── NotFound.jsx     # 404 page
│   │   ├── services/
│   │   │   └── api.js           # Axios instance + all API functions
│   │   ├── App.jsx              # React Router route definitions
│   │   ├── main.jsx             # React entry point + Toast provider
│   │   └── index.css            # Tailwind directives + global component classes
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   └── vite.config.js
│
├── database/
│   └── schema.sql               # MySQL schema + seed data
│
├── screenshots/                 # UI screenshots (see below)
├── docs/
├── .gitignore
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8.x running locally

---

### Step 1 — Database Setup

```bash
# Connect to MySQL
mysql -u root -p

# Run the schema (creates lms_db, all tables, and seed data)
source /path/to/database/schema.sql
```

Or run it directly:

```bash
mysql -u root -p < database/schema.sql
```

---

### Step 2 — Backend Setup

```bash
cd backend

# Create and activate a virtual environment
python -m venv venv
source venv/bin/activate          # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

> API is live at: **http://localhost:8000**
> Interactive Swagger docs: **http://localhost:8000/docs**

---

### Step 3 — Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

> Frontend is live at: **http://localhost:5173**

---

## API Reference

### Health & Dashboard

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Health check |
| GET | `/dashboard` | Aggregated stats (books, borrowers, transactions) |

### Books

| Method | Endpoint | Description |
|---|---|---|
| GET | `/books/` | Get all books |
| GET | `/books/{id}` | Get book by ID |
| POST | `/books/` | Add new book |
| PUT | `/books/{id}` | Update book fields |
| DELETE | `/books/{id}` | Delete book (blocked if borrowed) |

**POST /books/ — Request body:**
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "category": "Technology",
  "isbn": "978-0132350884"
}
```

### Borrowers

| Method | Endpoint | Description |
|---|---|---|
| GET | `/borrowers/` | Get all borrowers |
| GET | `/borrowers/{id}` | Get borrower by ID |
| POST | `/borrowers/` | Register new borrower |
| PUT | `/borrowers/{id}` | Update borrower details |
| DELETE | `/borrowers/{id}` | Delete borrower (blocked if active borrows exist) |

**POST /borrowers/ — Request body:**
```json
{
  "borrower_name": "Alice Johnson",
  "email": "alice@example.com",
  "phone": "9876543210"
}
```

### Transactions

| Method | Endpoint | Description |
|---|---|---|
| GET | `/transactions` | Get all transactions (with book + borrower details) |
| POST | `/borrow` | Borrow a book |
| POST | `/return` | Return a book |

**POST /borrow — Request body:**
```json
{ "book_id": 1, "borrower_id": 1 }
```

**POST /return — Request body:**
```json
{ "transaction_id": 1 }
```

### Search

| Method | Endpoint | Description |
|---|---|---|
| GET | `/search?query=clean` | Search by keyword (title, author, ISBN) |
| GET | `/search?category=Technology` | Filter by category |
| GET | `/search?author=martin` | Filter by author |
| GET | `/search?query=code&category=Technology` | Combined filters |

---

## Database Schema

### books

| Column | Type | Notes |
|---|---|---|
| book_id | INT | Primary key, auto-increment |
| title | VARCHAR(255) | Required |
| author | VARCHAR(255) | Required |
| category | VARCHAR(100) | Required |
| isbn | VARCHAR(50) | Required, unique |
| availability_status | ENUM | `Available` or `Borrowed` |
| created_at | TIMESTAMP | Auto |
| updated_at | TIMESTAMP | Auto-updated |

### borrowers

| Column | Type | Notes |
|---|---|---|
| borrower_id | INT | Primary key, auto-increment |
| borrower_name | VARCHAR(255) | Required |
| email | VARCHAR(255) | Required, unique |
| phone | VARCHAR(20) | Required |
| created_at | TIMESTAMP | Auto |
| updated_at | TIMESTAMP | Auto-updated |

### transactions

| Column | Type | Notes |
|---|---|---|
| transaction_id | INT | Primary key, auto-increment |
| book_id | INT | Foreign key → books |
| borrower_id | INT | Foreign key → borrowers |
| borrow_date | TIMESTAMP | Auto (on create) |
| return_date | TIMESTAMP | Nullable, set on return |
| status | ENUM | `Borrowed` or `Returned` |

---

## Screenshots

> Add screenshots to the `screenshots/` folder and link them here.

| Page | Description |
|---|---|
| `screenshots/dashboard.png` | Dashboard with stats cards and recent transactions |
| `screenshots/books.png` | Books management with table and status badges |
| `screenshots/add-book.png` | Add Book modal |
| `screenshots/borrowers.png` | Borrowers management page |
| `screenshots/borrow-return.png` | Borrow & Return workflow |
| `screenshots/transactions.png` | Transaction history with filter tabs |
| `screenshots/search.png` | Search page with book cards |
| `screenshots/api-docs.png` | Swagger API documentation |

---

## Phase 1 Scope

**Included:**
- Book, Borrower, and Transaction management (full CRUD)
- Borrow and Return workflow
- Search and filter functionality
- Dashboard with live statistics
- REST API with proper status codes and error handling

**Not included in Phase 1:**
- Authentication and authorisation
- Overdue fine calculation
- Email notifications
- AI/ML-powered search
- Cloud deployment

---

## Author

**Sanjana** — AFDE Jul 2025 Batch
Repository: `AFDE_Jul2025_Sanjana_LMS`
Project Code: `LMS`

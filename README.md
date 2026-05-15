# 📚 Library Management System

**AFDE_Jul2025_Sanjana_LMS** — Capstone Project Phase 1

A full-stack web application for managing library books, borrowers, and borrow/return transactions.

---

## Project Overview

Libraries often manage books and borrower records manually. This system digitises and streamlines library operations through a centralized web application, enabling librarians to manage books, track borrowers, record transactions, and search the catalogue efficiently.

---

## Features

- **Book Management** — Add, edit, delete, and view all books with availability tracking
- **Borrower Management** — Register and manage borrower profiles
- **Borrow & Return** — Record borrowing transactions and process returns
- **Search & Filter** — Search books by title, author, category, or keyword
- **Dashboard** — Live stats: total books, available, borrowed, and recent transactions

---

## Technology Stack

| Layer      | Technology              |
|------------|-------------------------|
| Frontend   | React (Vite) + Tailwind CSS |
| Backend    | Python FastAPI          |
| Database   | MySQL 8.x               |
| ORM        | SQLAlchemy 2.0          |
| HTTP Client| Axios                   |
| API Testing| Postman                 |

---

## Project Structure

```
AFDE_Jul2025_Sanjana_LMS/
│
├── backend/
│   ├── main.py           # FastAPI app entry point
│   ├── database.py       # DB engine & session
│   ├── models.py         # SQLAlchemy ORM models
│   ├── schemas.py        # Pydantic request/response models
│   ├── crud.py           # All DB operations
│   ├── routers/
│   │   ├── books.py
│   │   ├── borrowers.py
│   │   ├── transactions.py
│   │   └── search.py
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── components/   # Reusable UI components
│   │   ├── pages/        # Page-level components
│   │   ├── services/     # Axios API service layer
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
│
├── database/
│   └── schema.sql        # MySQL schema + seed data
│
├── screenshots/          # UI & API screenshots
├── docs/                 # Additional documentation
├── .gitignore
└── README.md
```

---

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js 18+
- MySQL 8.x running locally

### Database Setup

```bash
# Connect to MySQL
mysql -u root -p

# Run the schema script
source database/schema.sql
```

### Backend Setup

```bash
cd backend

# Create and activate virtual environment
python -m venv venv
source venv/bin/activate        # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start the server
uvicorn main:app --reload --port 8000
```

API will be available at: `http://localhost:8000`  
Interactive docs: `http://localhost:8000/docs`

### Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start the dev server
npm run dev
```

Frontend will be available at: `http://localhost:5173`

---

## API Reference

### Books

| Method | Endpoint        | Description          |
|--------|-----------------|----------------------|
| GET    | /books          | Get all books        |
| GET    | /books/{id}     | Get book by ID       |
| POST   | /books          | Add new book         |
| PUT    | /books/{id}     | Update book          |
| DELETE | /books/{id}     | Delete book          |

### Borrowers

| Method | Endpoint            | Description            |
|--------|---------------------|------------------------|
| GET    | /borrowers          | Get all borrowers      |
| GET    | /borrowers/{id}     | Get borrower by ID     |
| POST   | /borrowers          | Add borrower           |
| PUT    | /borrowers/{id}     | Update borrower        |
| DELETE | /borrowers/{id}     | Delete borrower        |

### Transactions

| Method | Endpoint        | Description             |
|--------|-----------------|-------------------------|
| POST   | /borrow         | Borrow a book           |
| POST   | /return         | Return a book           |
| GET    | /transactions   | View all transactions   |

### Search & Dashboard

| Method | Endpoint      | Description                          |
|--------|---------------|--------------------------------------|
| GET    | /search       | Search books (query, category, author)|
| GET    | /dashboard    | Get dashboard statistics             |

---

## Screenshots

> *(To be added after UI completion)*

- Dashboard
- Book Management
- Borrower Management
- Borrow / Return
- Search

---

## Database Schema

See [`database/schema.sql`](database/schema.sql) for the complete MySQL schema.

**Tables:** `books`, `borrowers`, `transactions`

---

## Author

**Sanjana** — AFDE Jul 2025 Batch  
Project Code: LMS

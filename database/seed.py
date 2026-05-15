"""
seed.py
-------
Populates the Library Management System with realistic demo data.

Usage:
    cd database
    python seed.py

Requirements:
    pip install requests
    Make sure the FastAPI backend is running on http://localhost:8000
"""

import requests
import sys

BASE = "http://localhost:8000"

# ── Colour helpers ─────────────────────────────────────────────────────────────
GREEN  = "\033[92m"
RED    = "\033[91m"
YELLOW = "\033[93m"
RESET  = "\033[0m"

def ok(msg):   print(f"  {GREEN}✓{RESET}  {msg}")
def err(msg):  print(f"  {RED}✗{RESET}  {msg}")
def info(msg): print(f"\n{YELLOW}{msg}{RESET}")


# ══════════════════════════════════════════════════════════════════════════════
#  DATA
# ══════════════════════════════════════════════════════════════════════════════

BOOKS = [
    # Technology
    {"title": "Clean Code",                    "author": "Robert C. Martin",   "category": "Technology",  "isbn": "978-0132350884"},
    {"title": "The Pragmatic Programmer",      "author": "Andrew Hunt",        "category": "Technology",  "isbn": "978-0201616224"},
    {"title": "Design Patterns",               "author": "Gang of Four",       "category": "Technology",  "isbn": "978-0201633610"},
    {"title": "You Don't Know JS",             "author": "Kyle Simpson",       "category": "Technology",  "isbn": "978-1491924464"},
    {"title": "Python Crash Course",           "author": "Eric Matthes",       "category": "Technology",  "isbn": "978-1593279288"},
    # Science
    {"title": "A Brief History of Time",       "author": "Stephen Hawking",    "category": "Science",     "isbn": "978-0553380163"},
    {"title": "The Selfish Gene",              "author": "Richard Dawkins",    "category": "Science",     "isbn": "978-0198788607"},
    {"title": "Cosmos",                        "author": "Carl Sagan",         "category": "Science",     "isbn": "978-0345331359"},
    # History
    {"title": "Sapiens",                       "author": "Yuval Noah Harari",  "category": "History",     "isbn": "978-0062316097"},
    {"title": "Guns, Germs and Steel",         "author": "Jared Diamond",      "category": "History",     "isbn": "978-0393317558"},
    {"title": "The Diary of a Young Girl",     "author": "Anne Frank",         "category": "History",     "isbn": "978-0553296983"},
    # Self-Help
    {"title": "Atomic Habits",                 "author": "James Clear",        "category": "Self-Help",   "isbn": "978-0735211292"},
    {"title": "Deep Work",                     "author": "Cal Newport",        "category": "Self-Help",   "isbn": "978-1455586691"},
    {"title": "The 7 Habits of Highly Effective People", "author": "Stephen R. Covey", "category": "Self-Help", "isbn": "978-0743269513"},
    # Fiction
    {"title": "1984",                          "author": "George Orwell",      "category": "Fiction",     "isbn": "978-0451524935"},
    {"title": "To Kill a Mockingbird",         "author": "Harper Lee",         "category": "Fiction",     "isbn": "978-0061935466"},
    {"title": "The Alchemist",                 "author": "Paulo Coelho",       "category": "Fiction",     "isbn": "978-0062315007"},
    {"title": "Dune",                          "author": "Frank Herbert",      "category": "Fiction",     "isbn": "978-0441013593"},
    # Biography
    {"title": "Steve Jobs",                    "author": "Walter Isaacson",    "category": "Biography",   "isbn": "978-1451648539"},
    {"title": "Elon Musk",                     "author": "Walter Isaacson",    "category": "Biography",   "isbn": "978-1982181284"},
    # Business
    {"title": "Zero to One",                   "author": "Peter Thiel",        "category": "Business",    "isbn": "978-0804139021"},
    {"title": "The Lean Startup",              "author": "Eric Ries",          "category": "Business",    "isbn": "978-0307887894"},
    # Philosophy
    {"title": "Meditations",                   "author": "Marcus Aurelius",    "category": "Philosophy",  "isbn": "978-0140449334"},
    {"title": "Man's Search for Meaning",      "author": "Viktor E. Frankl",   "category": "Philosophy",  "isbn": "978-0807014295"},
    # Mathematics
    {"title": "How to Solve It",               "author": "George Polya",       "category": "Mathematics", "isbn": "978-0691023564"},
]

BORROWERS = [
    {"borrower_name": "Priya Sharma",     "email": "priya.sharma@email.com",    "phone": "9876543210"},
    {"borrower_name": "Arjun Mehta",      "email": "arjun.mehta@email.com",     "phone": "9845612370"},
    {"borrower_name": "Sneha Reddy",      "email": "sneha.reddy@email.com",     "phone": "9123456789"},
    {"borrower_name": "Rahul Gupta",      "email": "rahul.gupta@email.com",     "phone": "9988776655"},
    {"borrower_name": "Ananya Iyer",      "email": "ananya.iyer@email.com",     "phone": "9765432100"},
    {"borrower_name": "Karthik Nair",     "email": "karthik.nair@email.com",    "phone": "9654321098"},
    {"borrower_name": "Divya Patel",      "email": "divya.patel@email.com",     "phone": "9543210987"},
    {"borrower_name": "Vikram Singh",     "email": "vikram.singh@email.com",    "phone": "9432109876"},
    {"borrower_name": "Meera Krishnan",   "email": "meera.krishnan@email.com",  "phone": "9321098765"},
    {"borrower_name": "Aditya Joshi",     "email": "aditya.joshi@email.com",    "phone": "9210987654"},
]

# Transactions: (book_title_keyword, borrower_name_keyword, action)
# action = "borrow" | "borrow_and_return"
TRANSACTIONS = [
    ("Clean Code",          "Priya Sharma",   "borrow"),
    ("Atomic Habits",       "Arjun Mehta",    "borrow"),
    ("Sapiens",             "Sneha Reddy",    "borrow_and_return"),
    ("1984",                "Rahul Gupta",    "borrow_and_return"),
    ("Deep Work",           "Ananya Iyer",    "borrow"),
    ("Steve Jobs",          "Karthik Nair",   "borrow_and_return"),
    ("Dune",                "Divya Patel",    "borrow"),
    ("Meditations",         "Vikram Singh",   "borrow_and_return"),
    ("Zero to One",         "Meera Krishnan", "borrow"),
    ("Python Crash Course", "Aditya Joshi",   "borrow_and_return"),
]


# ══════════════════════════════════════════════════════════════════════════════
#  HELPERS
# ══════════════════════════════════════════════════════════════════════════════

def check_backend():
    try:
        r = requests.get(f"{BASE}/", timeout=3)
        r.raise_for_status()
        return True
    except Exception:
        return False


def seed_books():
    info("Seeding books...")
    created, skipped = [], []

    for book in BOOKS:
        r = requests.post(f"{BASE}/books/", json=book)
        if r.status_code == 201:
            created.append(book["title"])
            ok(f"{book['title']}  [{book['category']}]")
        elif r.status_code == 409:
            skipped.append(book["title"])
            print(f"  –  Skipped (already exists): {book['title']}")
        else:
            err(f"Failed to add '{book['title']}': {r.status_code} {r.text}")

    print(f"\n  Books: {len(created)} added, {len(skipped)} already existed.")
    return created


def seed_borrowers():
    info("Seeding borrowers...")
    created, skipped = [], []

    for b in BORROWERS:
        r = requests.post(f"{BASE}/borrowers/", json=b)
        if r.status_code == 201:
            created.append(b["borrower_name"])
            ok(b["borrower_name"])
        elif r.status_code == 409:
            skipped.append(b["borrower_name"])
            print(f"  –  Skipped (already exists): {b['borrower_name']}")
        else:
            err(f"Failed to add '{b['borrower_name']}': {r.status_code} {r.text}")

    print(f"\n  Borrowers: {len(created)} added, {len(skipped)} already existed.")


def seed_transactions():
    info("Seeding transactions...")

    # Fetch current books and borrowers
    books     = requests.get(f"{BASE}/books/").json()
    borrowers = requests.get(f"{BASE}/borrowers/").json()

    book_map     = {b["title"].lower(): b for b in books}
    borrower_map = {b["borrower_name"].lower(): b for b in borrowers}

    done = 0
    for book_kw, borrower_kw, action in TRANSACTIONS:
        # Find book by keyword
        book = next(
            (v for k, v in book_map.items() if book_kw.lower() in k),
            None,
        )
        borrower = next(
            (v for k, v in borrower_map.items() if borrower_kw.lower() in k),
            None,
        )

        if not book:
            err(f"Book not found: '{book_kw}'")
            continue
        if not borrower:
            err(f"Borrower not found: '{borrower_kw}'")
            continue
        if book["availability_status"] != "Available":
            print(f"  –  Skipped: '{book['title']}' is already borrowed.")
            continue

        # Borrow
        borrow_res = requests.post(f"{BASE}/borrow", json={
            "book_id":     book["book_id"],
            "borrower_id": borrower["borrower_id"],
        })
        if borrow_res.status_code != 201:
            err(f"Borrow failed for '{book['title']}': {borrow_res.status_code}")
            continue

        transaction = borrow_res.json()

        if action == "borrow_and_return":
            ret = requests.post(f"{BASE}/return", json={
                "transaction_id": transaction["transaction_id"],
            })
            if ret.status_code == 200:
                ok(f"Borrowed + Returned: '{book['title']}' ← {borrower['borrower_name']}")
            else:
                err(f"Return failed for transaction {transaction['transaction_id']}")
        else:
            ok(f"Borrowed: '{book['title']}' ← {borrower['borrower_name']}")

        done += 1

    print(f"\n  Transactions: {done} processed.")


# ══════════════════════════════════════════════════════════════════════════════
#  MAIN
# ══════════════════════════════════════════════════════════════════════════════

if __name__ == "__main__":
    print(f"\n{'='*55}")
    print("  Library Management System — Database Seeder")
    print(f"{'='*55}")

    if not check_backend():
        err("Backend is not running. Start it with:")
        print("      cd backend && uvicorn main:app --reload")
        sys.exit(1)

    ok("Backend is running at " + BASE)

    seed_books()
    seed_borrowers()
    seed_transactions()

    print(f"\n{'='*55}")
    print(f"  {GREEN}Seeding complete! Refresh your browser.{RESET}")
    print(f"{'='*55}\n")

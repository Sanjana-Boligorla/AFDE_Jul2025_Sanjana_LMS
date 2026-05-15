-- ============================================================
--  Library Management System — MySQL Schema
--  Database: lms_db
-- ============================================================

CREATE DATABASE IF NOT EXISTS lms_db
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicode_ci;

USE lms_db;

-- ------------------------------------------------------------
--  Books Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS books (
    book_id            INT AUTO_INCREMENT PRIMARY KEY,
    title              VARCHAR(255)                        NOT NULL,
    author             VARCHAR(255)                        NOT NULL,
    category           VARCHAR(100)                        NOT NULL,
    isbn               VARCHAR(50)                         NOT NULL UNIQUE,
    availability_status ENUM('Available', 'Borrowed')      NOT NULL DEFAULT 'Available',
    created_at         TIMESTAMP                           NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at         TIMESTAMP                           NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
--  Borrowers Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS borrowers (
    borrower_id   INT AUTO_INCREMENT PRIMARY KEY,
    borrower_name VARCHAR(255) NOT NULL,
    email         VARCHAR(255) NOT NULL UNIQUE,
    phone         VARCHAR(20)  NOT NULL,
    created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- ------------------------------------------------------------
--  Transactions Table
-- ------------------------------------------------------------
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id INT AUTO_INCREMENT PRIMARY KEY,
    book_id        INT                          NOT NULL,
    borrower_id    INT                          NOT NULL,
    borrow_date    TIMESTAMP                    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    return_date    TIMESTAMP                    NULL,
    status         ENUM('Borrowed', 'Returned') NOT NULL DEFAULT 'Borrowed',
    CONSTRAINT fk_transaction_book
        FOREIGN KEY (book_id)     REFERENCES books(book_id)     ON DELETE RESTRICT,
    CONSTRAINT fk_transaction_borrower
        FOREIGN KEY (borrower_id) REFERENCES borrowers(borrower_id) ON DELETE RESTRICT
);

-- ------------------------------------------------------------
--  Sample Seed Data (optional — remove before production)
-- ------------------------------------------------------------
INSERT INTO books (title, author, category, isbn, availability_status) VALUES
    ('Clean Code',                'Robert C. Martin', 'Technology',  '978-0132350884', 'Available'),
    ('The Pragmatic Programmer',  'Andrew Hunt',      'Technology',  '978-0201616224', 'Available'),
    ('Design Patterns',           'Gang of Four',     'Technology',  '978-0201633610', 'Available'),
    ('Sapiens',                   'Yuval Noah Harari','History',     '978-0062316097', 'Available'),
    ('Atomic Habits',             'James Clear',      'Self-Help',   '978-0735211292', 'Available');

INSERT INTO borrowers (borrower_name, email, phone) VALUES
    ('Alice Johnson', 'alice@example.com', '9876543210'),
    ('Bob Smith',     'bob@example.com',   '9123456780');

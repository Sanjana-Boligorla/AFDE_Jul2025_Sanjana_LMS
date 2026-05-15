import axios from 'axios'

// ── Base instance ─────────────────────────────────────────────────────────────
const API = axios.create({
  baseURL: 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

// ── Response interceptor — unwrap data, surface error messages ────────────────
API.interceptors.response.use(
  (response) => response,
  (error) => {
    const message =
      error.response?.data?.detail ||
      error.response?.data?.message ||
      error.message ||
      'An unexpected error occurred.'
    return Promise.reject(new Error(message))
  },
)

// ══════════════════════════════════════════════════════════════════════════════
//  Dashboard
// ══════════════════════════════════════════════════════════════════════════════
export const getDashboardStats = () => API.get('/dashboard')

// ══════════════════════════════════════════════════════════════════════════════
//  Books
// ══════════════════════════════════════════════════════════════════════════════
export const getBooks       = ()          => API.get('/books/')
export const getBook        = (id)        => API.get(`/books/${id}`)
export const createBook     = (data)      => API.post('/books/', data)
export const updateBook     = (id, data)  => API.put(`/books/${id}`, data)
export const deleteBook     = (id)        => API.delete(`/books/${id}`)

// ══════════════════════════════════════════════════════════════════════════════
//  Borrowers
// ══════════════════════════════════════════════════════════════════════════════
export const getBorrowers   = ()          => API.get('/borrowers/')
export const getBorrower    = (id)        => API.get(`/borrowers/${id}`)
export const createBorrower = (data)      => API.post('/borrowers/', data)
export const updateBorrower = (id, data)  => API.put(`/borrowers/${id}`, data)
export const deleteBorrower = (id)        => API.delete(`/borrowers/${id}`)

// ══════════════════════════════════════════════════════════════════════════════
//  Transactions
// ══════════════════════════════════════════════════════════════════════════════
export const getTransactions = ()     => API.get('/transactions')
export const borrowBook      = (data) => API.post('/borrow', data)
export const returnBook      = (data) => API.post('/return', data)

// ══════════════════════════════════════════════════════════════════════════════
//  Search
// ══════════════════════════════════════════════════════════════════════════════
export const searchBooks = (params) => API.get('/search', { params })

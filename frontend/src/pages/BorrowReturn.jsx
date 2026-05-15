import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import {
  BookOpen, Users, ArrowLeftRight, RotateCcw,
  CheckCircle2, Clock, BookX,
} from 'lucide-react'
import {
  getBooks, getBorrowers, getTransactions,
  borrowBook, returnBook,
} from '../services/api'
import ConfirmModal from '../components/ConfirmModal'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'

// ── Borrow Form ───────────────────────────────────────────────────────────────
function BorrowForm({ availableBooks, borrowers, onBorrow, loading }) {
  const [bookId, setBookId]         = useState('')
  const [borrowerId, setBorrowerId] = useState('')
  const [errors, setErrors]         = useState({})

  const validate = () => {
    const e = {}
    if (!bookId)     e.bookId     = 'Please select a book'
    if (!borrowerId) e.borrowerId = 'Please select a borrower'
    return e
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onBorrow({ book_id: Number(bookId), borrower_id: Number(borrowerId) })
    setBookId('')
    setBorrowerId('')
    setErrors({})
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        {/* Book selector */}
        <div>
          <label className="form-label flex items-center gap-1.5">
            <BookOpen size={14} className="text-slate-500" />
            Select Book <span className="text-red-500">*</span>
          </label>
          <select
            value={bookId}
            onChange={(e) => { setBookId(e.target.value); setErrors((p) => ({ ...p, bookId: '' })) }}
            className={`form-input ${errors.bookId ? 'border-red-400 focus:ring-red-400' : ''}`}
          >
            <option value="">— Choose an available book —</option>
            {availableBooks.map((b) => (
              <option key={b.book_id} value={b.book_id}>
                {b.title} — {b.author} ({b.isbn})
              </option>
            ))}
          </select>
          {errors.bookId && <p className="form-error">{errors.bookId}</p>}
          {availableBooks.length === 0 && (
            <p className="text-xs text-amber-600 mt-1 flex items-center gap-1">
              <BookX size={12} /> No books are currently available for borrowing.
            </p>
          )}
        </div>

        {/* Borrower selector */}
        <div>
          <label className="form-label flex items-center gap-1.5">
            <Users size={14} className="text-slate-500" />
            Select Borrower <span className="text-red-500">*</span>
          </label>
          <select
            value={borrowerId}
            onChange={(e) => { setBorrowerId(e.target.value); setErrors((p) => ({ ...p, borrowerId: '' })) }}
            className={`form-input ${errors.borrowerId ? 'border-red-400 focus:ring-red-400' : ''}`}
          >
            <option value="">— Choose a borrower —</option>
            {borrowers.map((b) => (
              <option key={b.borrower_id} value={b.borrower_id}>
                {b.borrower_name} — {b.email}
              </option>
            ))}
          </select>
          {errors.borrowerId && <p className="form-error">{errors.borrowerId}</p>}
        </div>
      </div>

      <button
        type="submit"
        className="btn-primary w-full justify-center mt-5"
        disabled={loading || availableBooks.length === 0}
      >
        {loading ? (
          <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          <ArrowLeftRight size={16} />
        )}
        Confirm Borrow
      </button>
    </form>
  )
}

// ── Active Borrows Table ──────────────────────────────────────────────────────
function ActiveBorrowsTable({ transactions, onReturn, loading }) {
  const active = transactions.filter((t) => t.status === 'Borrowed')

  if (loading) return <LoadingSpinner message="Loading active borrows..." />

  if (active.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-14 text-slate-400">
        <CheckCircle2 size={40} className="mb-3 opacity-40" />
        <p className="text-sm font-medium text-slate-600">All books are returned!</p>
        <p className="text-xs mt-1">No active borrows at this time.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="bg-slate-50/80 border-b border-slate-200">
            <th className="table-header">#</th>
            <th className="table-header">Book</th>
            <th className="table-header">Borrower</th>
            <th className="table-header">Borrow Date</th>
            <th className="table-header">Status</th>
            <th className="table-header text-center">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {active.map((t, idx) => (
            <tr key={t.transaction_id} className="hover:bg-slate-50/80 transition-colors">
              <td className="table-cell text-slate-400 text-xs">{idx + 1}</td>
              <td className="table-cell">
                <p className="font-semibold text-slate-800">{t.book_title ?? '—'}</p>
                <p className="text-xs text-slate-400 font-mono">{t.book_isbn ?? ''}</p>
              </td>
              <td className="table-cell">
                <p className="text-slate-700">{t.borrower_name ?? '—'}</p>
                <p className="text-xs text-slate-400">{t.borrower_email ?? ''}</p>
              </td>
              <td className="table-cell text-slate-500 text-sm">
                <div className="flex items-center gap-1.5">
                  <Clock size={13} className="text-slate-400" />
                  {new Date(t.borrow_date).toLocaleDateString('en-US', {
                    month: 'short', day: 'numeric', year: 'numeric',
                  })}
                </div>
              </td>
              <td className="table-cell">
                <StatusBadge status={t.status} />
              </td>
              <td className="table-cell text-center">
                <button
                  onClick={() => onReturn(t)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium
                             bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200
                             rounded-lg transition-colors"
                >
                  <RotateCcw size={12} />
                  Return
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function BorrowReturn() {
  const [books, setBooks]               = useState([])
  const [borrowers, setBorrowers]       = useState([])
  const [transactions, setTransactions] = useState([])

  const [dataLoading, setDataLoading]   = useState(true)
  const [txLoading, setTxLoading]       = useState(true)
  const [borrowing, setBorrowing]       = useState(false)
  const [returning, setReturning]       = useState(false)

  const [returnTarget, setReturnTarget] = useState(null)

  // ── Fetch all needed data ──────────────────────────────────────────────────
  const fetchAll = useCallback(async () => {
    setTxLoading(true)
    try {
      const [booksRes, borrowersRes, txRes] = await Promise.all([
        getBooks(),
        getBorrowers(),
        getTransactions(),
      ])
      setBooks(booksRes.data)
      setBorrowers(borrowersRes.data)
      setTransactions(txRes.data)
    } catch {
      toast.error('Failed to load data')
    } finally {
      setDataLoading(false)
      setTxLoading(false)
    }
  }, [])

  useEffect(() => { fetchAll() }, [fetchAll])

  const availableBooks = books.filter((b) => b.availability_status === 'Available')

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleBorrow = async (payload) => {
    setBorrowing(true)
    try {
      const res = await borrowBook(payload)
      const bookName = res.data.book_title ?? 'Book'
      const who      = res.data.borrower_name ?? 'Borrower'
      toast.success(`"${bookName}" borrowed by ${who}!`)
      fetchAll()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setBorrowing(false)
    }
  }

  const handleReturn = async () => {
    setReturning(true)
    try {
      const res = await returnBook({ transaction_id: returnTarget.transaction_id })
      toast.success(`"${res.data.book_title ?? 'Book'}" returned successfully!`)
      setReturnTarget(null)
      fetchAll()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setReturning(false)
    }
  }

  // ── Summary counters ───────────────────────────────────────────────────────
  const totalBorrowed  = transactions.filter((t) => t.status === 'Borrowed').length
  const totalReturned  = transactions.filter((t) => t.status === 'Returned').length

  return (
    <div className="space-y-6">
      {/* Summary row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4 border-l-4 border-indigo-500">
          <div className="w-10 h-10 rounded-xl bg-indigo-100 flex items-center justify-center">
            <BookOpen size={20} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Available</p>
            <p className="text-2xl font-bold text-slate-800">{availableBooks.length}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4 border-l-4 border-amber-500">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <ArrowLeftRight size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active Borrows</p>
            <p className="text-2xl font-bold text-slate-800">{totalBorrowed}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4 border-l-4 border-emerald-500">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Returned</p>
            <p className="text-2xl font-bold text-slate-800">{totalReturned}</p>
          </div>
        </div>
      </div>

      {/* Main layout — borrow form + active borrows table */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Borrow Form */}
        <div className="lg:col-span-1">
          <div className="card p-5">
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                <ArrowLeftRight size={16} className="text-indigo-600" />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-slate-800">Borrow a Book</h2>
                <p className="text-xs text-slate-500">Assign a book to a borrower</p>
              </div>
            </div>
            {dataLoading ? (
              <LoadingSpinner message="Loading data..." />
            ) : (
              <BorrowForm
                availableBooks={availableBooks}
                borrowers={borrowers}
                onBorrow={handleBorrow}
                loading={borrowing}
              />
            )}
          </div>
        </div>

        {/* Active Borrows */}
        <div className="lg:col-span-2">
          <div className="card overflow-hidden">
            <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <Clock size={16} className="text-amber-600" />
                </div>
                <div>
                  <h2 className="text-sm font-semibold text-slate-800">Active Borrows</h2>
                  <p className="text-xs text-slate-500">Books currently checked out</p>
                </div>
              </div>
              {totalBorrowed > 0 && (
                <span className="text-xs font-medium bg-amber-100 text-amber-700 px-2.5 py-1 rounded-full">
                  {totalBorrowed} active
                </span>
              )}
            </div>
            <ActiveBorrowsTable
              transactions={transactions}
              onReturn={setReturnTarget}
              loading={txLoading}
            />
          </div>
        </div>
      </div>

      {/* Return Confirmation */}
      <ConfirmModal
        isOpen={!!returnTarget}
        onClose={() => setReturnTarget(null)}
        onConfirm={handleReturn}
        title="Confirm Return"
        message={`Mark "${returnTarget?.book_title}" as returned by ${returnTarget?.borrower_name}?`}
        confirmText="Confirm Return"
        loading={returning}
      />
    </div>
  )
}

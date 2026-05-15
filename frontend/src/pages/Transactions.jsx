import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { ClipboardList, Clock, CheckCircle2, ArrowLeftRight, RefreshCw } from 'lucide-react'
import { getTransactions } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'

// ── Filter tabs ───────────────────────────────────────────────────────────────
const FILTERS = ['All', 'Borrowed', 'Returned']

function FilterTab({ label, active, count, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg transition-all ${
        active
          ? 'bg-indigo-600 text-white shadow-sm'
          : 'text-slate-600 hover:bg-slate-100'
      }`}
    >
      {label}
      <span
        className={`text-xs px-1.5 py-0.5 rounded-full font-semibold ${
          active ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
        }`}
      >
        {count}
      </span>
    </button>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ filter }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
      <ClipboardList size={44} className="mb-3 opacity-40" />
      <p className="text-sm font-medium text-slate-600 mb-1">
        {filter === 'All'
          ? 'No transactions yet'
          : `No ${filter.toLowerCase()} transactions`}
      </p>
      <p className="text-xs">
        {filter === 'All'
          ? 'Transactions will appear here once books are borrowed.'
          : 'Try selecting a different filter.'}
      </p>
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Transactions() {
  const [transactions, setTransactions] = useState([])
  const [loading, setLoading]           = useState(true)
  const [activeFilter, setActiveFilter] = useState('All')
  const [refreshing, setRefreshing]     = useState(false)

  const fetchTransactions = useCallback(() => {
    setLoading(true)
    getTransactions()
      .then((res) => setTransactions(res.data))
      .catch(() => toast.error('Failed to load transactions'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchTransactions() }, [fetchTransactions])

  const handleRefresh = async () => {
    setRefreshing(true)
    await fetchTransactions()
    setRefreshing(false)
  }

  // ── Counts for filter tabs ─────────────────────────────────────────────────
  const counts = {
    All:      transactions.length,
    Borrowed: transactions.filter((t) => t.status === 'Borrowed').length,
    Returned: transactions.filter((t) => t.status === 'Returned').length,
  }

  // ── Filtered list ──────────────────────────────────────────────────────────
  const filtered =
    activeFilter === 'All'
      ? transactions
      : transactions.filter((t) => t.status === activeFilter)

  // ── Format date helper ─────────────────────────────────────────────────────
  const fmtDate = (dt) =>
    dt
      ? new Date(dt).toLocaleDateString('en-US', {
          month: 'short', day: 'numeric', year: 'numeric',
        })
      : null

  return (
    <div className="space-y-5">
      {/* Header stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="card p-4 flex items-center gap-4 border-l-4 border-slate-400">
          <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center">
            <ClipboardList size={20} className="text-slate-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total</p>
            <p className="text-2xl font-bold text-slate-800">{counts.All}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4 border-l-4 border-amber-500">
          <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center">
            <Clock size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Active Borrows</p>
            <p className="text-2xl font-bold text-slate-800">{counts.Borrowed}</p>
          </div>
        </div>
        <div className="card p-4 flex items-center gap-4 border-l-4 border-emerald-500">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 flex items-center justify-center">
            <CheckCircle2 size={20} className="text-emerald-600" />
          </div>
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Returned</p>
            <p className="text-2xl font-bold text-slate-800">{counts.Returned}</p>
          </div>
        </div>
      </div>

      {/* Filters + Refresh */}
      <div className="card p-4">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="flex items-center gap-2 bg-slate-50 p-1 rounded-xl">
            {FILTERS.map((f) => (
              <FilterTab
                key={f}
                label={f}
                active={activeFilter === f}
                count={counts[f]}
                onClick={() => setActiveFilter(f)}
              />
            ))}
          </div>
          <button
            onClick={handleRefresh}
            disabled={refreshing || loading}
            className="sm:ml-auto inline-flex items-center gap-2 px-3 py-2 text-sm text-slate-600
                       hover:bg-slate-100 rounded-lg transition-colors disabled:opacity-50"
          >
            <RefreshCw size={14} className={refreshing ? 'animate-spin' : ''} />
            Refresh
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Loading transactions..." />
        ) : filtered.length === 0 ? (
          <EmptyState filter={activeFilter} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="table-header w-12">#</th>
                  <th className="table-header">Book</th>
                  <th className="table-header">Borrower</th>
                  <th className="table-header">Borrow Date</th>
                  <th className="table-header">Return Date</th>
                  <th className="table-header">Status</th>
                  <th className="table-header text-right">Duration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((t, idx) => {
                  // Calculate duration in days
                  const start = new Date(t.borrow_date)
                  const end   = t.return_date ? new Date(t.return_date) : new Date()
                  const days  = Math.max(0, Math.floor((end - start) / 86400000))

                  return (
                    <tr
                      key={t.transaction_id}
                      className="hover:bg-slate-50/80 transition-colors"
                    >
                      <td className="table-cell text-slate-400 text-xs">
                        {idx + 1}
                      </td>
                      <td className="table-cell">
                        <p className="font-semibold text-slate-800">{t.book_title ?? '—'}</p>
                        <p className="text-xs text-slate-400 font-mono mt-0.5">{t.book_isbn ?? ''}</p>
                      </td>
                      <td className="table-cell">
                        <p className="text-slate-700 font-medium">{t.borrower_name ?? '—'}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{t.borrower_email ?? ''}</p>
                      </td>
                      <td className="table-cell text-slate-600 text-sm">
                        {fmtDate(t.borrow_date) ?? '—'}
                      </td>
                      <td className="table-cell text-sm">
                        {t.return_date ? (
                          <span className="text-slate-600">{fmtDate(t.return_date)}</span>
                        ) : (
                          <span className="text-slate-400 italic text-xs">Not returned</span>
                        )}
                      </td>
                      <td className="table-cell">
                        <StatusBadge status={t.status} />
                      </td>
                      <td className="table-cell text-right">
                        <span
                          className={`text-xs font-medium px-2 py-1 rounded-full ${
                            t.status === 'Borrowed'
                              ? days > 14
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {days}d
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Table footer */}
            <div className="px-4 py-3 border-t border-slate-100 bg-slate-50/50">
              <p className="text-xs text-slate-500">
                Showing {filtered.length} of {transactions.length} transaction{transactions.length !== 1 ? 's' : ''}
                {activeFilter !== 'All' && ` · Filtered by: ${activeFilter}`}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

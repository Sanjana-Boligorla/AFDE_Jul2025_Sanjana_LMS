import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  BookOpen, BookCheck, BookX, Users,
  ArrowRight, ArrowLeftRight, TrendingUp,
} from 'lucide-react'
import { getDashboardStats, getTransactions } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'

// ── Stat card ────────────────────────────────────────────────────────────────
function StatCard({ icon: Icon, label, value, color, bgColor, iconBg, linkTo, linkLabel }) {
  return (
    <div className={`card p-5 border-l-4 ${color}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-3xl font-bold text-slate-800">{value ?? '—'}</p>
          {linkTo && (
            <Link
              to={linkTo}
              className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-indigo-600 hover:text-indigo-700"
            >
              {linkLabel} <ArrowRight size={12} />
            </Link>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${iconBg}`}>
          <Icon size={22} className={`${bgColor}`} />
        </div>
      </div>
    </div>
  )
}

// ── Recent Transactions table ─────────────────────────────────────────────────
function RecentTransactions({ transactions, loading }) {
  if (loading) return <LoadingSpinner message="Loading transactions..." />

  if (!transactions.length) {
    return (
      <div className="text-center py-14 text-slate-400">
        <ArrowLeftRight size={36} className="mx-auto mb-3 opacity-40" />
        <p className="text-sm">No transactions yet.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50/60">
            <th className="table-header rounded-tl-lg">Book</th>
            <th className="table-header">Borrower</th>
            <th className="table-header">Borrow Date</th>
            <th className="table-header">Return Date</th>
            <th className="table-header rounded-tr-lg">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {transactions.map((t) => (
            <tr key={t.transaction_id} className="hover:bg-slate-50/70 transition-colors">
              <td className="table-cell font-medium text-slate-800">
                {t.book_title ?? '—'}
              </td>
              <td className="table-cell">{t.borrower_name ?? '—'}</td>
              <td className="table-cell text-slate-500">
                {t.borrow_date
                  ? new Date(t.borrow_date).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })
                  : '—'}
              </td>
              <td className="table-cell text-slate-500">
                {t.return_date
                  ? new Date(t.return_date).toLocaleDateString('en-US', {
                      month: 'short', day: 'numeric', year: 'numeric',
                    })
                  : <span className="text-slate-400 italic">Pending</span>}
              </td>
              <td className="table-cell">
                <StatusBadge status={t.status} />
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ── Page ───────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [stats, setStats]               = useState(null)
  const [transactions, setTransactions] = useState([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [txLoading, setTxLoading]       = useState(true)

  useEffect(() => {
    getDashboardStats()
      .then((res) => setStats(res.data))
      .catch(console.error)
      .finally(() => setStatsLoading(false))

    getTransactions()
      .then((res) => setTransactions(res.data.slice(0, 8)))
      .catch(console.error)
      .finally(() => setTxLoading(false))
  }, [])

  const statCards = [
    {
      icon: BookOpen, label: 'Total Books',
      value: stats?.total_books,
      color: 'border-blue-500',
      iconBg: 'bg-blue-100', bgColor: 'text-blue-600',
      linkTo: '/books', linkLabel: 'View all books',
    },
    {
      icon: BookCheck, label: 'Available Books',
      value: stats?.available_books,
      color: 'border-emerald-500',
      iconBg: 'bg-emerald-100', bgColor: 'text-emerald-600',
    },
    {
      icon: BookX, label: 'Borrowed Books',
      value: stats?.borrowed_books,
      color: 'border-amber-500',
      iconBg: 'bg-amber-100', bgColor: 'text-amber-600',
      linkTo: '/borrow-return', linkLabel: 'Manage borrows',
    },
    {
      icon: Users, label: 'Registered Borrowers',
      value: stats?.total_borrowers,
      color: 'border-purple-500',
      iconBg: 'bg-purple-100', bgColor: 'text-purple-600',
      linkTo: '/borrowers', linkLabel: 'View borrowers',
    },
  ]

  return (
    <div className="space-y-6">
      {/* Stats grid */}
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card p-5 h-28 animate-pulse bg-slate-100" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card) => (
            <StatCard key={card.label} {...card} />
          ))}
        </div>
      )}

      {/* Quick actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link
          to="/books"
          className="card p-4 flex items-center gap-4 hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-indigo-100 flex items-center justify-center group-hover:bg-indigo-200 transition-colors">
            <BookOpen size={20} className="text-indigo-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Manage Books</p>
            <p className="text-xs text-slate-500">Add, edit, or remove books</p>
          </div>
          <ArrowRight size={16} className="ml-auto text-slate-400 group-hover:text-indigo-600 transition-colors" />
        </Link>

        <Link
          to="/borrowers"
          className="card p-4 flex items-center gap-4 hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-purple-100 flex items-center justify-center group-hover:bg-purple-200 transition-colors">
            <Users size={20} className="text-purple-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Manage Borrowers</p>
            <p className="text-xs text-slate-500">Register and manage borrowers</p>
          </div>
          <ArrowRight size={16} className="ml-auto text-slate-400 group-hover:text-purple-600 transition-colors" />
        </Link>

        <Link
          to="/borrow-return"
          className="card p-4 flex items-center gap-4 hover:border-indigo-300 hover:shadow-md transition-all group"
        >
          <div className="w-10 h-10 rounded-lg bg-amber-100 flex items-center justify-center group-hover:bg-amber-200 transition-colors">
            <ArrowLeftRight size={20} className="text-amber-600" />
          </div>
          <div>
            <p className="text-sm font-semibold text-slate-800">Borrow / Return</p>
            <p className="text-xs text-slate-500">Record transactions</p>
          </div>
          <ArrowRight size={16} className="ml-auto text-slate-400 group-hover:text-amber-600 transition-colors" />
        </Link>
      </div>

      {/* Recent transactions */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-2">
            <TrendingUp size={18} className="text-indigo-600" />
            <h2 className="text-sm font-semibold text-slate-800">Recent Transactions</h2>
          </div>
          <Link
            to="/transactions"
            className="text-xs font-medium text-indigo-600 hover:text-indigo-700 flex items-center gap-1"
          >
            View all <ArrowRight size={12} />
          </Link>
        </div>
        <RecentTransactions transactions={transactions} loading={txLoading} />
      </div>
    </div>
  )
}

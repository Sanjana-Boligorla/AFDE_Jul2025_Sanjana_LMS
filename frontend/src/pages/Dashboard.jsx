import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { BookOpen, BookCheck, BookX, Users, ArrowRight, ArrowLeftRight, TrendingUp } from 'lucide-react'
import { getDashboardStats, getTransactions } from '../services/api'
import StatusBadge from '../components/StatusBadge'

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />
}

function StatCard({ icon: Icon, label, value, borderColor, iconBg, iconColor, linkTo, linkLabel }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 border-l-4 ${borderColor} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 p-5`}>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
          <p className="text-4xl font-bold text-slate-800 tracking-tight">
            {value ?? <Skeleton className="h-9 w-16 mt-1" />}
          </p>
          {linkTo && (
            <Link to={linkTo} className={`inline-flex items-center gap-1 mt-3 text-xs font-semibold ${iconColor} hover:gap-2 transition-all duration-150`}>
              {linkLabel} <ArrowRight size={12} />
            </Link>
          )}
        </div>
        <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon size={22} className={iconColor} />
        </div>
      </div>
    </div>
  )
}

function QuickAction({ to, icon: Icon, title, subtitle, iconBg, iconColor }) {
  return (
    <Link to={to} className="flex items-center gap-4 p-4 bg-white rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${iconBg} group-hover:scale-110 transition-transform duration-200`}>
        <Icon size={19} className={iconColor} />
      </div>
      <div className="min-w-0">
        <p className="text-sm font-semibold text-slate-800">{title}</p>
        <p className="text-xs text-slate-500">{subtitle}</p>
      </div>
      <ArrowRight size={15} className="ml-auto shrink-0 text-slate-300 group-hover:text-slate-500 group-hover:translate-x-0.5 transition-all" />
    </Link>
  )
}

function RecentTransactions({ transactions, loading }) {
  if (loading) {
    return (
      <div className="divide-y divide-slate-100">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-4">
            <Skeleton className="w-9 h-9 rounded-xl shrink-0" />
            <div className="flex-1 space-y-2"><Skeleton className="h-3 w-2/5" /><Skeleton className="h-3 w-1/4" /></div>
            <Skeleton className="h-5 w-16 rounded-full" />
          </div>
        ))}
      </div>
    )
  }
  if (!transactions.length) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-slate-400">
        <div className="w-14 h-14 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
          <ArrowLeftRight size={24} className="text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600 mb-1">No transactions yet</p>
        <p className="text-xs text-slate-400 mb-4">Borrow a book to see activity here.</p>
        <Link to="/borrow-return" className="btn-primary text-xs px-4 py-2">Record First Borrow</Link>
      </div>
    )
  }
  return (
    <div className="divide-y divide-slate-100">
      {transactions.map((t) => (
        <div key={t.transaction_id} className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors">
          <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${t.status === 'Borrowed' ? 'bg-amber-100' : 'bg-emerald-100'}`}>
            <ArrowLeftRight size={15} className={t.status === 'Borrowed' ? 'text-amber-600' : 'text-emerald-600'} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-800 truncate">{t.book_title ?? '—'}</p>
            <p className="text-xs text-slate-400 truncate">{t.borrower_name ?? '—'}</p>
          </div>
          <div className="text-right shrink-0 space-y-1">
            <StatusBadge status={t.status} />
            <p className="text-xs text-slate-400">
              {new Date(t.borrow_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [stats, setStats]               = useState(null)
  const [transactions, setTransactions] = useState([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [txLoading, setTxLoading]       = useState(true)

  useEffect(() => {
    getDashboardStats().then((r) => setStats(r.data)).catch(console.error).finally(() => setStatsLoading(false))
    getTransactions().then((r) => setTransactions(r.data.slice(0, 3))).catch(console.error).finally(() => setTxLoading(false))
  }, [])

  const statCards = [
    { icon: BookOpen,  label: 'Total Books',           value: stats?.total_books,      borderColor: 'border-l-blue-500',   iconBg: 'bg-blue-50',   iconColor: 'text-blue-600',   linkTo: '/books',         linkLabel: 'View all books'   },
    { icon: BookCheck, label: 'Available Books',        value: stats?.available_books,  borderColor: 'border-l-emerald-500',iconBg: 'bg-emerald-50',iconColor: 'text-emerald-600' },
    { icon: BookX,     label: 'Borrowed Books',         value: stats?.borrowed_books,   borderColor: 'border-l-amber-500',  iconBg: 'bg-amber-50',  iconColor: 'text-amber-600',  linkTo: '/borrow-return', linkLabel: 'Manage borrows'   },
    { icon: Users,     label: 'Registered Borrowers',   value: stats?.total_borrowers,  borderColor: 'border-l-purple-500', iconBg: 'bg-purple-50', iconColor: 'text-purple-600', linkTo: '/borrowers',     linkLabel: 'View borrowers'   },
  ]

  return (
    <div className="space-y-5 page-fade-in">
      {statsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
              <div className="flex justify-between items-start mb-4"><Skeleton className="h-3 w-24" /><Skeleton className="w-11 h-11 rounded-xl" /></div>
              <Skeleton className="h-9 w-16 mb-3" /><Skeleton className="h-3 w-28" />
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statCards.map((card) => <StatCard key={card.label} {...card} />)}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Actions</p>
          <div className="flex flex-col gap-3">
            <QuickAction to="/books"         icon={BookOpen}       title="Manage Books"      subtitle="Add, edit, or remove books"         iconBg="bg-indigo-50" iconColor="text-indigo-600" />
            <QuickAction to="/borrowers"     icon={Users}          title="Manage Borrowers"  subtitle="Register and update borrowers"       iconBg="bg-purple-50" iconColor="text-purple-600" />
            <QuickAction to="/borrow-return" icon={ArrowLeftRight} title="Borrow / Return"   subtitle="Issue books and process returns"     iconBg="bg-amber-50"  iconColor="text-amber-600"  />
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden flex flex-col">
          <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
                <TrendingUp size={15} className="text-indigo-600" />
              </div>
              <h2 className="text-sm font-semibold text-slate-800">Recent Transactions</h2>
            </div>
            {transactions.length > 0 && (
              <Link to="/transactions" className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 hover:gap-1.5 transition-all">
                View all <ArrowRight size={12} />
              </Link>
            )}
          </div>
          <div className="flex-1">
            <RecentTransactions transactions={transactions} loading={txLoading} />
          </div>
        </div>
      </div>
    </div>
  )
}

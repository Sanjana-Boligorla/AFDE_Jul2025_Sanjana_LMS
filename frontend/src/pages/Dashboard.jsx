import { useEffect, useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  BookOpen, BookCheck, BookX, Users, ArrowRight, ArrowLeftRight,
  TrendingUp, PieChart as PieIcon, BarChart2,
} from 'lucide-react'
import { getDashboardStats, getTransactions, getBooks } from '../services/api'
import StatusBadge from '../components/StatusBadge'

// ── Animated counter ──────────────────────────────────────────────────────────
function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (target == null) return
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - progress, 3)
      setValue(Math.round(ease * target))
      if (progress < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [target, duration])
  return value
}

function Skeleton({ className = '' }) {
  return <div className={`animate-pulse bg-slate-100 rounded-lg ${className}`} />
}

// ── Stat Card with animated number ───────────────────────────────────────────
function StatCard({ icon: Icon, label, value, borderColor, iconBg, iconColor, linkTo, linkLabel, delay = 0 }) {
  const [visible, setVisible] = useState(false)
  const count = useCountUp(visible ? (value ?? 0) : 0)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay)
    return () => clearTimeout(t)
  }, [delay])

  return (
    <div
      className={`bg-white rounded-2xl border border-slate-200 border-l-4 ${borderColor} shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-300 p-5`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(12px)',
        transition: `opacity 0.4s ease ${delay}ms, transform 0.4s ease ${delay}ms, box-shadow 0.2s, translate 0.2s`,
      }}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">{label}</p>
          <p className="text-4xl font-bold text-slate-800 tracking-tight">
            {value == null ? <Skeleton className="h-9 w-16 mt-1" /> : count}
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

// ── Animated SVG Donut ────────────────────────────────────────────────────────
const DONUT_COLORS = ['#10b981', '#f59e0b']

function AnimatedDonut({ available, borrowed }) {
  const total = available + borrowed
  const pct = total ? available / total : 0

  const R = 54
  const STROKE = 18
  const cx = 72
  const circumference = 2 * Math.PI * R

  const [progress, setProgress] = useState(0)
  const [hovered, setHovered] = useState(null)

  useEffect(() => {
    if (!total) return
    const start = performance.now()
    const duration = 1100
    const tick = (now) => {
      const t = Math.min((now - start) / duration, 1)
      const ease = 1 - Math.pow(1 - t, 3)
      setProgress(ease)
      if (t < 1) requestAnimationFrame(tick)
    }
    requestAnimationFrame(tick)
  }, [total])

  const availDash = circumference * pct * progress
  const borrowDash = circumference * (1 - pct) * progress
  const gap = total ? 4 : 0

  const data = [
    { name: 'Available', value: available, color: DONUT_COLORS[0] },
    { name: 'Borrowed',  value: borrowed,  color: DONUT_COLORS[1] },
  ]

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex-1">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
          <PieIcon size={15} className="text-indigo-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">Book Availability</h3>
      </div>

      <div className="flex items-center gap-6">
        {/* SVG donut */}
        <div className="relative shrink-0" style={{ width: 144, height: 144 }}>
          <svg width={144} height={144} viewBox="0 0 144 144">
            {/* track */}
            <circle cx={cx} cy={cx} r={R} fill="none" stroke="#f1f5f9" strokeWidth={STROKE} />

            {total === 0 ? (
              <circle cx={cx} cy={cx} r={R} fill="none" stroke="#e2e8f0" strokeWidth={STROKE} />
            ) : (
              <>
                {/* available arc */}
                <circle
                  cx={cx} cy={cx} r={R}
                  fill="none"
                  stroke={DONUT_COLORS[0]}
                  strokeWidth={hovered === 'Available' ? STROKE + 4 : STROKE}
                  strokeDasharray={`${Math.max(0, availDash - gap)} ${circumference}`}
                  strokeDashoffset={circumference * 0.25}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-width 0.2s' }}
                  onMouseEnter={() => setHovered('Available')}
                  onMouseLeave={() => setHovered(null)}
                />
                {/* borrowed arc */}
                <circle
                  cx={cx} cy={cx} r={R}
                  fill="none"
                  stroke={DONUT_COLORS[1]}
                  strokeWidth={hovered === 'Borrowed' ? STROKE + 4 : STROKE}
                  strokeDasharray={`${Math.max(0, borrowDash - gap)} ${circumference}`}
                  strokeDashoffset={circumference * 0.25 - availDash}
                  strokeLinecap="round"
                  style={{ transition: 'stroke-width 0.2s' }}
                  onMouseEnter={() => setHovered('Borrowed')}
                  onMouseLeave={() => setHovered(null)}
                />
              </>
            )}
          </svg>

          {/* centre label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            {hovered ? (
              <>
                <p className="text-lg font-bold text-slate-800 leading-none">
                  {hovered === 'Available' ? available : borrowed}
                </p>
                <p className="text-[10px] text-slate-400 mt-0.5">{hovered}</p>
              </>
            ) : (
              <>
                <p className="text-xl font-bold text-slate-800 leading-none">{total}</p>
                <p className="text-xs text-slate-400 mt-0.5">books</p>
              </>
            )}
          </div>
        </div>

        {/* Legend with mini progress bars */}
        <div className="flex flex-col gap-4 flex-1">
          {data.map((d) => (
            <div key={d.name}>
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ background: d.color }} />
                  <p className="text-xs font-medium text-slate-700">{d.name}</p>
                </div>
                <span className="text-sm font-bold text-slate-800">{d.value}</span>
              </div>
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-out"
                  style={{
                    width: total ? `${(d.value / total) * 100 * progress}%` : '0%',
                    background: d.color,
                  }}
                />
              </div>
              <p className="text-[10px] text-slate-400 mt-0.5">
                {total ? Math.round((d.value / total) * 100) : 0}%
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Bar Chart — Books by Category ─────────────────────────────────────────────
function CategoryChart({ books }) {
  const categoryMap = {}
  books.forEach((b) => {
    categoryMap[b.category] = (categoryMap[b.category] ?? 0) + 1
  })
  const data = Object.entries(categoryMap)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8)

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload?.length) {
      return (
        <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 shadow-lg text-xs">
          <p className="font-semibold text-slate-800">{label}</p>
          <p className="text-slate-500">{payload[0].value} book{payload[0].value !== 1 ? 's' : ''}</p>
        </div>
      )
    }
    return null
  }

  if (!data.length) return null

  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex-1">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-indigo-100 flex items-center justify-center">
          <BarChart2 size={15} className="text-indigo-600" />
        </div>
        <h3 className="text-sm font-semibold text-slate-800">Books by Category</h3>
      </div>
      <ResponsiveContainer width="100%" height={180}>
        <BarChart data={data} margin={{ top: 0, right: 8, left: -28, bottom: 0 }} barSize={22}>
          <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
          <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fontSize: 10, fill: '#94a3b8' }} tickLine={false} axisLine={false} allowDecimals={false} />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: '#f8fafc' }} />
          <Bar
            dataKey="count"
            fill="#6366f1"
            radius={[6, 6, 0, 0]}
            isAnimationActive={true}
            animationBegin={200}
            animationDuration={900}
            animationEasing="ease-out"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}

// ── Quick Action ──────────────────────────────────────────────────────────────
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

// ── Recent Transactions ───────────────────────────────────────────────────────
function RecentTransactions({ transactions, loading }) {
  if (loading) {
    return (
      <div className="divide-y divide-slate-100">
        {[...Array(3)].map((_, i) => (
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
      <div className="flex flex-col items-center justify-center py-12 text-slate-400">
        <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center mb-3">
          <ArrowLeftRight size={20} className="text-slate-400" />
        </div>
        <p className="text-sm font-medium text-slate-600 mb-1">No transactions yet</p>
        <Link to="/borrow-return" className="btn-primary text-xs px-4 py-2 mt-3">Record First Borrow</Link>
      </div>
    )
  }
  return (
    <div className="divide-y divide-slate-100">
      {transactions.map((t, i) => (
        <div
          key={t.transaction_id}
          className="flex items-center gap-4 px-5 py-3.5 hover:bg-slate-50 transition-colors"
          style={{
            animation: `rowSlideIn 0.3s ease both`,
            animationDelay: `${i * 80}ms`,
          }}
        >
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

// ── Page ──────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const [stats, setStats]               = useState(null)
  const [transactions, setTransactions] = useState([])
  const [books, setBooks]               = useState([])
  const [statsLoading, setStatsLoading] = useState(true)
  const [txLoading, setTxLoading]       = useState(true)
  const [booksLoading, setBooksLoading] = useState(true)

  useEffect(() => {
    getDashboardStats().then((r) => setStats(r.data)).catch(console.error).finally(() => setStatsLoading(false))
    getTransactions().then((r) => setTransactions(r.data.slice(0, 3))).catch(console.error).finally(() => setTxLoading(false))
    getBooks().then((r) => setBooks(r.data)).catch(console.error).finally(() => setBooksLoading(false))
  }, [])

  const statCards = [
    { icon: BookOpen,  label: 'Total Books',          value: stats?.total_books,     borderColor: 'border-l-blue-500',    iconBg: 'bg-blue-50',    iconColor: 'text-blue-600',   linkTo: '/books',         linkLabel: 'View all books', delay: 0   },
    { icon: BookCheck, label: 'Available Books',       value: stats?.available_books, borderColor: 'border-l-emerald-500', iconBg: 'bg-emerald-50', iconColor: 'text-emerald-600',                                                            delay: 80  },
    { icon: BookX,     label: 'Borrowed Books',        value: stats?.borrowed_books,  borderColor: 'border-l-amber-500',   iconBg: 'bg-amber-50',   iconColor: 'text-amber-600',  linkTo: '/borrow-return', linkLabel: 'Manage borrows', delay: 160 },
    { icon: Users,     label: 'Registered Borrowers',  value: stats?.total_borrowers, borderColor: 'border-l-purple-500',  iconBg: 'bg-purple-50',  iconColor: 'text-purple-600', linkTo: '/borrowers',     linkLabel: 'View borrowers', delay: 240 },
  ]

  return (
    <>
      <style>{`
        @keyframes rowSlideIn {
          from { opacity: 0; transform: translateX(-8px); }
          to   { opacity: 1; transform: translateX(0); }
        }
      `}</style>

      <div className="space-y-5 page-fade-in">

        {/* Stat cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {statsLoading
            ? [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 p-5">
                  <div className="flex justify-between items-start mb-4"><Skeleton className="h-3 w-24" /><Skeleton className="w-11 h-11 rounded-xl" /></div>
                  <Skeleton className="h-9 w-16 mb-3" /><Skeleton className="h-3 w-28" />
                </div>
              ))
            : statCards.map((card) => <StatCard key={card.label} {...card} />)
          }
        </div>

        {/* Charts row */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-stretch">
          <div className="lg:col-span-2 flex flex-col">
            {statsLoading ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 h-48"><Skeleton className="w-full h-full" /></div>
            ) : (
              <AnimatedDonut available={stats?.available_books ?? 0} borrowed={stats?.borrowed_books ?? 0} />
            )}
          </div>
          <div className="lg:col-span-3 flex flex-col">
            {booksLoading ? (
              <div className="bg-white rounded-2xl border border-slate-200 p-5 h-48"><Skeleton className="w-full h-full" /></div>
            ) : (
              <CategoryChart books={books} />
            )}
          </div>
        </div>

        {/* Quick Actions + Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 items-stretch">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5 flex flex-col gap-3">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Quick Actions</p>
            <div className="flex flex-col gap-3">
              <QuickAction to="/books"         icon={BookOpen}       title="Manage Books"     subtitle="Add, edit, or remove books"       iconBg="bg-indigo-50" iconColor="text-indigo-600" />
              <QuickAction to="/borrowers"     icon={Users}          title="Manage Borrowers" subtitle="Register and update borrowers"    iconBg="bg-purple-50" iconColor="text-purple-600" />
              <QuickAction to="/borrow-return" icon={ArrowLeftRight} title="Borrow / Return"  subtitle="Issue books and process returns"  iconBg="bg-amber-50"  iconColor="text-amber-600"  />
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
    </>
  )
}

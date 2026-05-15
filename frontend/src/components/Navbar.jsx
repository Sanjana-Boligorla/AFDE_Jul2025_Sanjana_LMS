import { useLocation } from 'react-router-dom'
import { Bell, ChevronRight } from 'lucide-react'

const pageMeta = {
  '/':              { title: 'Dashboard',       crumb: null },
  '/books':         { title: 'Books',           crumb: 'Books' },
  '/borrowers':     { title: 'Borrowers',       crumb: 'Borrowers' },
  '/borrow-return': { title: 'Borrow & Return', crumb: 'Borrow / Return' },
  '/transactions':  { title: 'Transactions',    crumb: 'Transactions' },
  '/search':        { title: 'Search Books',    crumb: 'Search' },
}

export default function Navbar() {
  const { pathname } = useLocation()
  const meta = pageMeta[pathname] ?? { title: 'Library MS', crumb: null }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-20">

      {/* Breadcrumb + title */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-0.5">
          <span>Library MS</span>
          {meta.crumb && (
            <>
              <ChevronRight size={11} />
              <span className="text-slate-600 font-medium">{meta.crumb}</span>
            </>
          )}
        </div>
        <h1 className="text-base font-bold text-slate-800 truncate leading-tight">{meta.title}</h1>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Date */}
        <span className="hidden md:inline-flex items-center gap-2 text-xs text-slate-500
                         bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-lg">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          {new Date().toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
          })}
        </span>

        {/* Bell */}
        <button className="w-9 h-9 flex items-center justify-center rounded-lg text-slate-400
                           hover:bg-slate-100 hover:text-slate-600 transition-colors">
          <Bell size={17} />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center
                        text-white text-xs font-bold shadow-sm cursor-pointer">
          S
        </div>
      </div>
    </header>
  )
}

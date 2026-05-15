import { useLocation } from 'react-router-dom'
import { Bell } from 'lucide-react'

const pageTitles = {
  '/':              { title: 'Dashboard',       subtitle: 'Welcome back — here\'s what\'s happening today.' },
  '/books':         { title: 'Books',           subtitle: 'Manage your library catalogue.' },
  '/borrowers':     { title: 'Borrowers',       subtitle: 'Manage registered borrowers.' },
  '/borrow-return': { title: 'Borrow & Return', subtitle: 'Record new borrows or process returns.' },
  '/transactions':  { title: 'Transactions',    subtitle: 'Full history of all borrow and return activity.' },
  '/search':        { title: 'Search Books',    subtitle: 'Find books by title, author, or category.' },
}

export default function Navbar() {
  const { pathname } = useLocation()
  const { title, subtitle } = pageTitles[pathname] ?? { title: 'Library MS', subtitle: '' }

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4">
      {/* Page info */}
      <div className="flex-1 min-w-0">
        <h1 className="text-base font-semibold text-slate-800 truncate">{title}</h1>
        <p className="text-xs text-slate-500 truncate hidden sm:block">{subtitle}</p>
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 shrink-0">
        {/* Date badge */}
        <span className="hidden md:inline-flex text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full">
          {new Date().toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric', year: 'numeric',
          })}
        </span>

        {/* Notification icon */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-lg text-slate-500 hover:bg-slate-100 hover:text-slate-700 transition-colors">
          <Bell size={18} />
        </button>

        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-xs font-semibold">
          S
        </div>
      </div>
    </header>
  )
}

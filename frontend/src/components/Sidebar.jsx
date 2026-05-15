import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard, BookOpen, Users,
  ArrowLeftRight, ClipboardList, Search, Library,
} from 'lucide-react'

const navItems = [
  { to: '/',              icon: LayoutDashboard, label: 'Dashboard'       },
  { to: '/books',         icon: BookOpen,        label: 'Books'           },
  { to: '/borrowers',     icon: Users,           label: 'Borrowers'       },
  { to: '/borrow-return', icon: ArrowLeftRight,  label: 'Borrow / Return' },
  { to: '/transactions',  icon: ClipboardList,   label: 'Transactions'    },
  { to: '/search',        icon: Search,          label: 'Search Books'    },
]

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 flex flex-col z-30 shadow-xl">

      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/50">
        <div className="w-9 h-9 bg-indigo-600 rounded-xl flex items-center justify-center shrink-0 shadow-md">
          <Library size={19} className="text-white" />
        </div>
        <div>
          <p className="text-white font-bold text-sm leading-tight">Library MS</p>
          <p className="text-slate-400 text-xs">Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          Main Menu
        </p>

        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
               transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-900/40'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            {({ isActive }) => (
              <>
                {/* Active left accent */}
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5
                                   bg-indigo-300 rounded-full" />
                )}
                <Icon size={17} className={isActive ? 'text-white' : 'text-slate-500'} />
                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-slate-700/50">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-slate-800/60">
          <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center
                          text-white text-xs font-bold shrink-0">
            L
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-semibold truncate">Librarian</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              <p className="text-slate-400 text-xs">Online</p>
            </div>
          </div>
        </div>
      </div>
    </aside>
  )
}

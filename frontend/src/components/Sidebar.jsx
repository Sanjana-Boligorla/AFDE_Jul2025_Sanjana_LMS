import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowLeftRight,
  ClipboardList,
  Search,
  Library,
} from 'lucide-react'

const navItems = [
  { to: '/',              icon: LayoutDashboard, label: 'Dashboard'      },
  { to: '/books',         icon: BookOpen,        label: 'Books'          },
  { to: '/borrowers',     icon: Users,           label: 'Borrowers'      },
  { to: '/borrow-return', icon: ArrowLeftRight,  label: 'Borrow / Return'},
  { to: '/transactions',  icon: ClipboardList,   label: 'Transactions'   },
  { to: '/search',        icon: Search,          label: 'Search Books'   },
]

export default function Sidebar() {
  return (
    <aside className="fixed top-0 left-0 h-full w-64 bg-slate-900 flex flex-col z-30 shadow-xl">
      {/* Brand */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-slate-700/60">
        <div className="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0">
          <Library size={20} className="text-white" />
        </div>
        <div>
          <p className="text-white font-semibold text-sm leading-tight">Library MS</p>
          <p className="text-slate-400 text-xs">Management System</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <p className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Main Menu
        </p>
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/40'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-700/60">
        <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg bg-slate-800/60">
          <div className="w-7 h-7 rounded-full bg-indigo-500 flex items-center justify-center text-white text-xs font-bold shrink-0">
            L
          </div>
          <div className="min-w-0">
            <p className="text-white text-xs font-medium truncate">Librarian</p>
            <p className="text-slate-400 text-xs truncate">Admin</p>
          </div>
        </div>
      </div>
    </aside>
  )
}

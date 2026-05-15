import { Link } from 'react-router-dom'
import { Home, AlertCircle } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <div className="w-20 h-20 rounded-2xl bg-slate-100 flex items-center justify-center mb-6">
        <AlertCircle size={40} className="text-slate-400" />
      </div>
      <h1 className="text-5xl font-bold text-slate-800 mb-2">404</h1>
      <h2 className="text-lg font-semibold text-slate-600 mb-2">Page Not Found</h2>
      <p className="text-sm text-slate-400 max-w-xs mb-8">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Link to="/" className="btn-primary">
        <Home size={16} />
        Back to Dashboard
      </Link>
    </div>
  )
}

// Milestone 4 — full implementation coming next
import { Search as SearchIcon } from 'lucide-react'

export default function Search() {
  return (
    <div className="card p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
      <div className="w-14 h-14 rounded-full bg-indigo-100 flex items-center justify-center mb-4">
        <SearchIcon size={26} className="text-indigo-600" />
      </div>
      <h2 className="text-lg font-semibold text-slate-800 mb-1">Search Books</h2>
      <p className="text-sm text-slate-500">Coming in Milestone 4</p>
    </div>
  )
}

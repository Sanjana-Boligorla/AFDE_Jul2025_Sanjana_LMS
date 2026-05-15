// Milestone 3 — full implementation coming next
import { Users } from 'lucide-react'

export default function Borrowers() {
  return (
    <div className="card p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
      <div className="w-14 h-14 rounded-full bg-purple-100 flex items-center justify-center mb-4">
        <Users size={26} className="text-purple-600" />
      </div>
      <h2 className="text-lg font-semibold text-slate-800 mb-1">Borrowers Management</h2>
      <p className="text-sm text-slate-500">Coming in Milestone 3</p>
    </div>
  )
}

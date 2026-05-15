// Milestone 3 — full implementation coming next
import { ClipboardList } from 'lucide-react'

export default function Transactions() {
  return (
    <div className="card p-10 flex flex-col items-center justify-center text-center min-h-[400px]">
      <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center mb-4">
        <ClipboardList size={26} className="text-blue-600" />
      </div>
      <h2 className="text-lg font-semibold text-slate-800 mb-1">Transaction History</h2>
      <p className="text-sm text-slate-500">Coming in Milestone 3</p>
    </div>
  )
}

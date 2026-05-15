/**
 * StatusBadge — coloured pill for book availability or transaction status.
 */
export default function StatusBadge({ status }) {
  const styles = {
    Available: 'bg-emerald-100 text-emerald-700',
    Borrowed:  'bg-amber-100  text-amber-700',
    Returned:  'bg-slate-100  text-slate-600',
  }

  const dots = {
    Available: 'bg-emerald-500',
    Borrowed:  'bg-amber-500',
    Returned:  'bg-slate-400',
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${styles[status] ?? 'bg-slate-100 text-slate-600'}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dots[status] ?? 'bg-slate-400'}`} />
      {status}
    </span>
  )
}

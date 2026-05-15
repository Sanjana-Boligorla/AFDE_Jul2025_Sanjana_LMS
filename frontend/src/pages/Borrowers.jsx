import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Users, Search, X, Mail, Phone } from 'lucide-react'
import { getBorrowers, createBorrower, updateBorrower, deleteBorrower } from '../services/api'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import LoadingSpinner from '../components/LoadingSpinner'

const EMPTY_FORM = { borrower_name: '', email: '', phone: '' }

function BorrowerForm({ initialData = EMPTY_FORM, onSubmit, onCancel, loading }) {
  const [form, setForm]     = useState(initialData)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.borrower_name.trim()) e.borrower_name = 'Name is required'
    if (!form.email.trim()) {
      e.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      e.email = 'Enter a valid email address'
    }
    if (!form.phone.trim()) e.phone = 'Phone number is required'
    return e
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setForm((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: '' }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    onSubmit(form)
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        <div>
          <label className="form-label">Full Name <span className="text-red-500">*</span></label>
          <input name="borrower_name" value={form.borrower_name} onChange={handleChange}
            placeholder="e.g. Alice Johnson"
            className={`form-input ${errors.borrower_name ? 'border-red-400' : ''}`} />
          {errors.borrower_name && <p className="form-error">{errors.borrower_name}</p>}
        </div>
        <div>
          <label className="form-label">Email Address <span className="text-red-500">*</span></label>
          <div className="relative">
            <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input name="email" type="email" value={form.email} onChange={handleChange}
              placeholder="e.g. alice@example.com"
              className={`form-input pl-9 ${errors.email ? 'border-red-400' : ''}`} />
          </div>
          {errors.email && <p className="form-error">{errors.email}</p>}
        </div>
        <div>
          <label className="form-label">Phone Number <span className="text-red-500">*</span></label>
          <div className="relative">
            <Phone size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input name="phone" value={form.phone} onChange={handleChange}
              placeholder="e.g. 9876543210"
              className={`form-input pl-9 ${errors.phone ? 'border-red-400' : ''}`} />
          </div>
          {errors.phone && <p className="form-error">{errors.phone}</p>}
        </div>
      </div>
      <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
        <button type="button" onClick={onCancel} className="btn-secondary flex-1" disabled={loading}>Cancel</button>
        <button type="submit" className="btn-primary flex-1 justify-center" disabled={loading}>
          {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
          {initialData.borrower_name ? 'Save Changes' : 'Add Borrower'}
        </button>
      </div>
    </form>
  )
}

function Avatar({ name }) {
  const initials = name.split(' ').map((w) => w[0]).slice(0, 2).join('').toUpperCase()
  const colors = ['bg-indigo-100 text-indigo-700','bg-purple-100 text-purple-700','bg-pink-100 text-pink-700','bg-blue-100 text-blue-700','bg-emerald-100 text-emerald-700','bg-amber-100 text-amber-700']
  const color = colors[name.charCodeAt(0) % colors.length]
  return <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${color}`}>{initials}</div>
}

export default function Borrowers() {
  const [borrowers, setBorrowers]       = useState([])
  const [loading, setLoading]           = useState(true)
  const [search, setSearch]             = useState('')
  const [addOpen, setAddOpen]           = useState(false)
  const [editBorrower, setEditBorrower] = useState(null)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [submitting, setSubmitting]     = useState(false)
  const [deleting, setDeleting]         = useState(false)

  const fetchBorrowers = useCallback(() => {
    setLoading(true)
    getBorrowers()
      .then((res) => setBorrowers(res.data))
      .catch(() => toast.error('Failed to load borrowers'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchBorrowers() }, [fetchBorrowers])

  const filtered = borrowers.filter((b) => {
    const q = search.toLowerCase()
    return b.borrower_name.toLowerCase().includes(q) || b.email.toLowerCase().includes(q) || b.phone.includes(q)
  })

  const handleAdd = async (formData) => {
    setSubmitting(true)
    try {
      await createBorrower(formData)
      toast.success(`${formData.borrower_name} registered successfully!`)
      setAddOpen(false); fetchBorrowers()
    } catch (err) { toast.error(err.message) }
    finally { setSubmitting(false) }
  }

  const handleEdit = async (formData) => {
    setSubmitting(true)
    try {
      await updateBorrower(editBorrower.borrower_id, formData)
      toast.success(`${formData.borrower_name} updated!`)
      setEditBorrower(null); fetchBorrowers()
    } catch (err) { toast.error(err.message) }
    finally { setSubmitting(false) }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteBorrower(deleteTarget.borrower_id)
      toast.success(`${deleteTarget.borrower_name} removed.`)
      setDeleteTarget(null); fetchBorrowers()
    } catch (err) { toast.error(err.message) }
    finally { setDeleting(false) }
  }

  return (
    <div className="space-y-5 page-fade-in">
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={search} onChange={(e) => setSearch(e.target.value)}
              placeholder="Search name, email, phone..." className="form-input pl-9 pr-8" />
            {search && <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={14} /></button>}
          </div>
          <div className="flex items-center gap-3 sm:ml-auto">
            <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
              {filtered.length} of {borrowers.length} borrower{borrowers.length !== 1 ? 's' : ''}
            </span>
            <button onClick={() => setAddOpen(true)} className="btn-primary">
              <Plus size={16} /> Add Borrower
            </button>
          </div>
        </div>
      </div>

      <div className="card overflow-hidden">
        {loading ? <LoadingSpinner message="Loading borrowers..." /> : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Users size={44} className="mb-3 opacity-40" />
            <p className="text-sm font-medium text-slate-600 mb-1">{search ? 'No borrowers match your search' : 'No borrowers registered yet'}</p>
            {search && <button onClick={() => setSearch('')} className="text-xs text-indigo-600 hover:underline mt-1">Clear search</button>}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="table-header w-8">#</th>
                  <th className="table-header">Borrower</th>
                  <th className="table-header">Email</th>
                  <th className="table-header">Phone</th>
                  <th className="table-header">Registered</th>
                  <th className="table-header text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((b, idx) => (
                  <tr key={b.borrower_id} className="hover:bg-indigo-50/20 transition-colors">
                    <td className="table-cell text-slate-400 text-xs">{idx + 1}</td>
                    <td className="table-cell">
                      <div className="flex items-center gap-3">
                        <Avatar name={b.borrower_name} />
                        <span className="font-semibold text-slate-800">{b.borrower_name}</span>
                      </div>
                    </td>
                    <td className="table-cell"><a href={`mailto:${b.email}`} className="text-indigo-600 hover:underline">{b.email}</a></td>
                    <td className="table-cell text-slate-600">{b.phone}</td>
                    <td className="table-cell text-slate-500 text-xs">
                      {new Date(b.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => setEditBorrower(b)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"><Pencil size={15} /></button>
                        <button onClick={() => setDeleteTarget(b)} className="w-8 h-8 flex items-center justify-center rounded-lg text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"><Trash2 size={15} /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <Modal isOpen={addOpen} onClose={() => setAddOpen(false)} title="Register New Borrower">
        <BorrowerForm onSubmit={handleAdd} onCancel={() => setAddOpen(false)} loading={submitting} />
      </Modal>

      <Modal isOpen={!!editBorrower} onClose={() => setEditBorrower(null)} title="Edit Borrower">
        {editBorrower && (
          <BorrowerForm
            initialData={{ borrower_name: editBorrower.borrower_name, email: editBorrower.email, phone: editBorrower.phone }}
            onSubmit={handleEdit} onCancel={() => setEditBorrower(null)} loading={submitting}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={handleDelete}
        title="Remove Borrower"
        message={`Remove "${deleteTarget?.borrower_name}"? This will fail if they have active borrows.`}
        confirmText="Remove Borrower" loading={deleting}
      />
    </div>
  )
}

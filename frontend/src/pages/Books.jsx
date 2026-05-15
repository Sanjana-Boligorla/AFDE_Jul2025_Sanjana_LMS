import { useEffect, useState, useCallback } from 'react'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, BookOpen, Search, X } from 'lucide-react'
import { getBooks, createBook, updateBook, deleteBook } from '../services/api'
import Modal from '../components/Modal'
import ConfirmModal from '../components/ConfirmModal'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'

// ── Book Form (used for Add and Edit) ────────────────────────────────────────
const EMPTY_FORM = { title: '', author: '', category: '', isbn: '' }

function BookForm({ initialData = EMPTY_FORM, onSubmit, onCancel, loading }) {
  const [form, setForm]     = useState(initialData)
  const [errors, setErrors] = useState({})

  const validate = () => {
    const e = {}
    if (!form.title.trim())    e.title    = 'Title is required'
    if (!form.author.trim())   e.author   = 'Author is required'
    if (!form.category.trim()) e.category = 'Category is required'
    if (!form.isbn.trim())     e.isbn     = 'ISBN is required'
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

  const categories = [
    'Technology', 'Science', 'Mathematics', 'History', 'Literature',
    'Self-Help', 'Biography', 'Fiction', 'Non-Fiction', 'Philosophy',
    'Art & Design', 'Business', 'Other',
  ]

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div className="space-y-4">
        {/* Title */}
        <div>
          <label className="form-label">Title <span className="text-red-500">*</span></label>
          <input
            name="title"
            value={form.title}
            onChange={handleChange}
            placeholder="e.g. Clean Code"
            className={`form-input ${errors.title ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
          {errors.title && <p className="form-error">{errors.title}</p>}
        </div>

        {/* Author */}
        <div>
          <label className="form-label">Author <span className="text-red-500">*</span></label>
          <input
            name="author"
            value={form.author}
            onChange={handleChange}
            placeholder="e.g. Robert C. Martin"
            className={`form-input ${errors.author ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
          {errors.author && <p className="form-error">{errors.author}</p>}
        </div>

        {/* Category */}
        <div>
          <label className="form-label">Category <span className="text-red-500">*</span></label>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            className={`form-input ${errors.category ? 'border-red-400 focus:ring-red-400' : ''}`}
          >
            <option value="">Select a category</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          {errors.category && <p className="form-error">{errors.category}</p>}
        </div>

        {/* ISBN */}
        <div>
          <label className="form-label">ISBN <span className="text-red-500">*</span></label>
          <input
            name="isbn"
            value={form.isbn}
            onChange={handleChange}
            placeholder="e.g. 978-0132350884"
            className={`form-input ${errors.isbn ? 'border-red-400 focus:ring-red-400' : ''}`}
          />
          {errors.isbn && <p className="form-error">{errors.isbn}</p>}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-3 mt-6 pt-4 border-t border-slate-200">
        <button
          type="button"
          onClick={onCancel}
          className="btn-secondary flex-1"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary flex-1 justify-center"
          disabled={loading}
        >
          {loading && (
            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
          )}
          {initialData.title ? 'Save Changes' : 'Add Book'}
        </button>
      </div>
    </form>
  )
}

// ── Empty state ───────────────────────────────────────────────────────────────
function EmptyState({ hasSearch, onClear }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-slate-400">
      <BookOpen size={44} className="mb-3 opacity-40" />
      {hasSearch ? (
        <>
          <p className="text-sm font-medium text-slate-600 mb-1">No books match your search</p>
          <button onClick={onClear} className="text-xs text-indigo-600 hover:underline mt-1">
            Clear search
          </button>
        </>
      ) : (
        <>
          <p className="text-sm font-medium text-slate-600 mb-1">No books yet</p>
          <p className="text-xs">Add your first book to get started.</p>
        </>
      )}
    </div>
  )
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function Books() {
  const [books, setBooks]           = useState([])
  const [loading, setLoading]       = useState(true)
  const [search, setSearch]         = useState('')

  // Modal states
  const [addOpen, setAddOpen]       = useState(false)
  const [editBook, setEditBook]     = useState(null)   // book object being edited
  const [deleteTarget, setDeleteTarget] = useState(null) // book object to delete

  const [submitting, setSubmitting] = useState(false)
  const [deleting, setDeleting]     = useState(false)

  // ── Fetch books ─────────────────────────────────────────────────────────────
  const fetchBooks = useCallback(() => {
    setLoading(true)
    getBooks()
      .then((res) => setBooks(res.data))
      .catch(() => toast.error('Failed to load books'))
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => { fetchBooks() }, [fetchBooks])

  // ── Filtered list ────────────────────────────────────────────────────────────
  const filtered = books.filter((b) => {
    const q = search.toLowerCase()
    return (
      b.title.toLowerCase().includes(q)    ||
      b.author.toLowerCase().includes(q)   ||
      b.category.toLowerCase().includes(q) ||
      b.isbn.toLowerCase().includes(q)
    )
  })

  // ── Handlers ──────────────────────────────────────────────────────────────
  const handleAdd = async (formData) => {
    setSubmitting(true)
    try {
      await createBook(formData)
      toast.success(`"${formData.title}" added successfully!`)
      setAddOpen(false)
      fetchBooks()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = async (formData) => {
    setSubmitting(true)
    try {
      await updateBook(editBook.book_id, formData)
      toast.success(`"${formData.title}" updated successfully!`)
      setEditBook(null)
      fetchBooks()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async () => {
    setDeleting(true)
    try {
      await deleteBook(deleteTarget.book_id)
      toast.success(`"${deleteTarget.title}" deleted.`)
      setDeleteTarget(null)
      fetchBooks()
    } catch (err) {
      toast.error(err.message)
    } finally {
      setDeleting(false)
    }
  }

  return (
    <div className="space-y-5 page-fade-in">
      {/* Page header */}
      <div className="card p-5">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search title, author, ISBN…"
              className="form-input pl-9 pr-8"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X size={14} />
              </button>
            )}
          </div>

          {/* Stats + Add button */}
          <div className="flex items-center gap-3 sm:ml-auto">
            <span className="text-xs text-slate-500 bg-slate-100 px-3 py-1.5 rounded-full font-medium">
              {filtered.length} of {books.length} book{books.length !== 1 ? 's' : ''}
            </span>
            <button onClick={() => setAddOpen(true)} className="btn-primary">
              <Plus size={16} />
              Add Book
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        {loading ? (
          <LoadingSpinner message="Loading books..." />
        ) : filtered.length === 0 ? (
          <EmptyState hasSearch={!!search} onClear={() => setSearch('')} />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-slate-50/80 border-b border-slate-200">
                  <th className="table-header w-8">#</th>
                  <th className="table-header">Title</th>
                  <th className="table-header">Author</th>
                  <th className="table-header">Category</th>
                  <th className="table-header">ISBN</th>
                  <th className="table-header">Status</th>
                  <th className="table-header text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtered.map((book, idx) => (
                  <tr
                    key={book.book_id}
                    className="hover:bg-indigo-50/20 transition-colors group"
                  >
                    <td className="table-cell text-slate-400 text-xs">{idx + 1}</td>
                    <td className="table-cell font-semibold text-slate-800 max-w-[200px]">
                      <span className="truncate block" title={book.title}>{book.title}</span>
                    </td>
                    <td className="table-cell text-slate-600">{book.author}</td>
                    <td className="table-cell">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-600">
                        {book.category}
                      </span>
                    </td>
                    <td className="table-cell text-slate-500 font-mono text-xs">{book.isbn}</td>
                    <td className="table-cell">
                      <StatusBadge status={book.availability_status} />
                    </td>
                    <td className="table-cell">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => setEditBook(book)}
                          title="Edit book"
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                     text-slate-400 hover:text-indigo-600 hover:bg-indigo-50
                                     transition-colors"
                        >
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => setDeleteTarget(book)}
                          title="Delete book"
                          disabled={book.availability_status === 'Borrowed'}
                          className="w-8 h-8 flex items-center justify-center rounded-lg
                                     text-slate-400 hover:text-red-600 hover:bg-red-50
                                     transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Modal */}
      <Modal
        isOpen={addOpen}
        onClose={() => setAddOpen(false)}
        title="Add New Book"
      >
        <BookForm
          onSubmit={handleAdd}
          onCancel={() => setAddOpen(false)}
          loading={submitting}
        />
      </Modal>

      {/* Edit Modal */}
      <Modal
        isOpen={!!editBook}
        onClose={() => setEditBook(null)}
        title="Edit Book"
      >
        {editBook && (
          <BookForm
            initialData={{
              title:    editBook.title,
              author:   editBook.author,
              category: editBook.category,
              isbn:     editBook.isbn,
            }}
            onSubmit={handleEdit}
            onCancel={() => setEditBook(null)}
            loading={submitting}
          />
        )}
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        title="Delete Book"
        message={`Are you sure you want to delete "${deleteTarget?.title}"? This cannot be undone.`}
        confirmText="Delete Book"
        loading={deleting}
      />
    </div>
  )
}

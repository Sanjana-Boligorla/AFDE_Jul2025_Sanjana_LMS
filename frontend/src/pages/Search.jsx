import { useEffect, useState, useRef } from 'react'
import { Search as SearchIcon, BookOpen, X, SlidersHorizontal, BookMarked } from 'lucide-react'
import { searchBooks } from '../services/api'
import StatusBadge from '../components/StatusBadge'
import LoadingSpinner from '../components/LoadingSpinner'

const CATEGORIES = [
  'All Categories',
  'Technology', 'Science', 'Mathematics', 'History', 'Literature',
  'Self-Help', 'Biography', 'Fiction', 'Non-Fiction', 'Philosophy',
  'Art & Design', 'Business', 'Other',
]

function BookCard({ book }) {
  const categoryColors = {
    Technology: 'bg-blue-100 text-blue-700', Science: 'bg-teal-100 text-teal-700',
    History: 'bg-amber-100 text-amber-700', Literature: 'bg-purple-100 text-purple-700',
    'Self-Help': 'bg-green-100 text-green-700', Biography: 'bg-orange-100 text-orange-700',
    Fiction: 'bg-pink-100 text-pink-700', Mathematics: 'bg-indigo-100 text-indigo-700',
    Business: 'bg-cyan-100 text-cyan-700',
  }
  const catColor = categoryColors[book.category] ?? 'bg-slate-100 text-slate-600'
  return (
    <div className="card p-5 flex flex-col gap-3 hover:shadow-md hover:border-indigo-200 hover:-translate-y-0.5 transition-all duration-200 group">
      <div className="flex items-start justify-between gap-2">
        <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors shrink-0">
          <BookMarked size={20} className="text-indigo-500" />
        </div>
        <StatusBadge status={book.availability_status} />
      </div>
      <div>
        <h3 className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2">{book.title}</h3>
        <p className="text-xs text-slate-500 mt-1">{book.author}</p>
      </div>
      <div className="flex items-center justify-between mt-auto pt-3 border-t border-slate-100 gap-2">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${catColor}`}>{book.category}</span>
        <span className="text-xs text-slate-400 font-mono truncate">{book.isbn}</span>
      </div>
    </div>
  )
}

function PlaceholderState({ type }) {
  if (type === 'initial') {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-slate-400">
        <div className="w-16 h-16 rounded-2xl bg-indigo-50 flex items-center justify-center mb-4">
          <SearchIcon size={30} className="text-indigo-400" />
        </div>
        <p className="text-sm font-medium text-slate-600 mb-1">Start searching the catalogue</p>
        <p className="text-xs text-center max-w-xs text-slate-400">Type a title, author, or ISBN — or use the filters to browse by category or author.</p>
      </div>
    )
  }
  return (
    <div className="flex flex-col items-center justify-center py-24 text-slate-400">
      <div className="w-16 h-16 rounded-2xl bg-slate-100 flex items-center justify-center mb-4">
        <BookOpen size={30} className="text-slate-400" />
      </div>
      <p className="text-sm font-medium text-slate-600 mb-1">No books found</p>
      <p className="text-xs text-center max-w-xs">Try different keywords or clear the filters.</p>
    </div>
  )
}

export default function Search() {
  const [query, setQuery]       = useState('')
  const [category, setCategory] = useState('')
  const [author, setAuthor]     = useState('')
  const [results, setResults]   = useState([])
  const [loading, setLoading]   = useState(false)
  const [searched, setSearched] = useState(false)
  const debounceRef = useRef(null)

  useEffect(() => {
    const hasInput = query.trim() || category || author.trim()
    if (!hasInput) { setResults([]); setSearched(false); return }
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(runSearch, 400)
    return () => clearTimeout(debounceRef.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, category, author])

  const runSearch = async () => {
    const params = {}
    if (query.trim())  params.query    = query.trim()
    if (category)      params.category = category
    if (author.trim()) params.author   = author.trim()
    setLoading(true); setSearched(true)
    try { const res = await searchBooks(params); setResults(res.data) }
    catch { setResults([]) }
    finally { setLoading(false) }
  }

  const clearAll = () => { setQuery(''); setCategory(''); setAuthor(''); setResults([]); setSearched(false) }
  const hasFilters = query || category || author
  const availableCount = results.filter((b) => b.availability_status === 'Available').length

  return (
    <div className="space-y-5 page-fade-in">
      <div className="card p-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <div className="relative">
            <SearchIcon size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by title, author, or ISBN…" autoFocus
              className="w-full pl-11 pr-10 py-3 text-sm border border-slate-200 rounded-xl bg-white
                         placeholder-slate-400 shadow-sm focus:outline-none focus:ring-2
                         focus:ring-indigo-500/30 focus:border-indigo-400 transition" />
            {query && <button onClick={() => setQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={16} /></button>}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="flex-1 relative">
              <SlidersHorizontal size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <select value={category} onChange={(e) => setCategory(e.target.value === 'All Categories' ? '' : e.target.value)} className="form-input pl-9 text-sm">
                {CATEGORIES.map((c) => <option key={c} value={c === 'All Categories' ? '' : c}>{c}</option>)}
              </select>
            </div>
            <div className="flex-1 relative">
              <BookOpen size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder="Filter by author…" className="form-input pl-9 text-sm" />
              {author && <button onClick={() => setAuthor('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"><X size={13} /></button>}
            </div>
            {hasFilters && (
              <button onClick={clearAll} className="inline-flex items-center gap-1.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-100 border border-slate-200 rounded-xl transition-colors whitespace-nowrap">
                <X size={14} /> Clear all
              </button>
            )}
          </div>
        </div>
      </div>

      {searched && !loading && (
        <div className="flex items-center justify-between px-1 flex-wrap gap-2">
          <p className="text-sm text-slate-600">
            <span className="font-semibold text-slate-800">{results.length}</span> {results.length === 1 ? 'result' : 'results'} found
            {results.length > 0 && <span className="text-slate-400 ml-2">· {availableCount} available</span>}
          </p>
          <div className="flex items-center gap-2 flex-wrap">
            {query && <span className="inline-flex items-center gap-1 text-xs bg-indigo-100 text-indigo-700 px-2.5 py-1 rounded-full font-medium">"{query}" <button onClick={() => setQuery('')}><X size={11} /></button></span>}
            {category && <span className="inline-flex items-center gap-1 text-xs bg-purple-100 text-purple-700 px-2.5 py-1 rounded-full font-medium">{category} <button onClick={() => setCategory('')}><X size={11} /></button></span>}
            {author && <span className="inline-flex items-center gap-1 text-xs bg-emerald-100 text-emerald-700 px-2.5 py-1 rounded-full font-medium">Author: {author} <button onClick={() => setAuthor('')}><X size={11} /></button></span>}
          </div>
        </div>
      )}

      {loading ? (
        <div className="card"><LoadingSpinner message="Searching catalogue..." /></div>
      ) : !searched ? (
        <div className="card"><PlaceholderState type="initial" /></div>
      ) : results.length === 0 ? (
        <div className="card"><PlaceholderState type="empty" /></div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {results.map((book) => <BookCard key={book.book_id} book={book} />)}
        </div>
      )}
    </div>
  )
}

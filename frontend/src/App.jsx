import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Dashboard    from './pages/Dashboard'
import Books        from './pages/Books'
import Borrowers    from './pages/Borrowers'
import BorrowReturn from './pages/BorrowReturn'
import Transactions from './pages/Transactions'
import Search       from './pages/Search'
import NotFound     from './pages/NotFound'

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/"              element={<Dashboard />}    />
        <Route path="/books"         element={<Books />}        />
        <Route path="/borrowers"     element={<Borrowers />}    />
        <Route path="/borrow-return" element={<BorrowReturn />} />
        <Route path="/transactions"  element={<Transactions />} />
        <Route path="/search"        element={<Search />}       />
        <Route path="*"              element={<NotFound />}     />
      </Routes>
    </Layout>
  )
}

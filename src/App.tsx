import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import ArticlesPage from './pages/ArticlesPage'
import ArticleDetailPage from './pages/ArticleDetailPage'

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/articles" replace />} />
      <Route element={<Layout />}>
        <Route path="/articles" element={<ArticlesPage />} />
        <Route path="/articles/:id" element={<ArticleDetailPage />} />
      </Route>
    </Routes>
  )
}

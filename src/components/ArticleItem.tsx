import { useNavigate } from 'react-router-dom'
import type { Article } from '../api/articles'

interface Props {
  article: Article
}

function formatDate(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

export default function ArticleItem({ article }: Props) {
  const navigate = useNavigate()

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => navigate(`/articles/${article.id}`)}
      onKeyDown={(e) => e.key === 'Enter' && navigate(`/articles/${article.id}`)}
      className={`
        border-l-2 px-4 py-3 cursor-pointer hover:bg-gray-50 transition-colors border-b border-gray-100
        ${article.is_read ? 'border-l-transparent' : 'border-l-blue-500'}
      `}
    >
      <div className="flex items-start justify-between gap-2">
        <h3
          className={`text-sm leading-snug flex-1 ${
            article.is_read ? 'font-normal text-gray-500' : 'font-semibold text-gray-900'
          }`}
        >
          {article.title}
        </h3>
        {article.is_starred && (
          <span className="shrink-0 text-yellow-400 text-xs mt-0.5">★</span>
        )}
      </div>
      <p className="mt-1 text-xs text-gray-400">
        {article.feed_title}
        {article.published_at && (
          <> · {formatDate(article.published_at)}</>
        )}
      </p>
    </div>
  )
}

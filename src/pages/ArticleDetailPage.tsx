import { useParams, useNavigate } from 'react-router-dom'
import DOMPurify from 'dompurify'
import { useArticle, useUpdateArticle } from '../hooks/useArticles'

export default function ArticleDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const articleId = Number(id)

  const { data: article, isLoading, isError } = useArticle(articleId)
  const updateArticle = useUpdateArticle()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-400">
        加载中…
      </div>
    )
  }

  if (isError || !article) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-red-400">
        文章加载失败
      </div>
    )
  }

  const toggleStar = () => {
    updateArticle.mutate({ id: articleId, updates: { is_starred: !article.is_starred } })
  }

  const safeHtml = DOMPurify.sanitize(article.content || '')

  return (
    <div className="max-w-2xl mx-auto px-6 py-6">
      {/* 顶部操作栏 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          ← 返回
        </button>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleStar}
            className={`text-sm transition-colors ${
              article.is_starred ? 'text-yellow-400 hover:text-yellow-500' : 'text-gray-300 hover:text-yellow-400'
            }`}
            title={article.is_starred ? '取消收藏' : '收藏'}
          >
            {article.is_starred ? '★' : '☆'}
          </button>
          {article.link && (
            <a
              href={article.link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
            >
              原文 ↗
            </a>
          )}
        </div>
      </div>

      {/* 标题 */}
      <h1 className="text-xl font-bold text-gray-900 leading-tight mb-2">
        {article.title}
      </h1>

      {/* 元信息 */}
      <p className="text-xs text-gray-400 mb-6">
        {article.feed_title}
        {article.author && <> · {article.author}</>}
        {article.published_at && (
          <> · {new Date(article.published_at).toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' })}</>
        )}
      </p>

      {/* 正文 */}
      {safeHtml ? (
        <div
          className="text-sm text-gray-700 leading-relaxed space-y-4"
          style={{
            lineHeight: '1.75',
          }}
          dangerouslySetInnerHTML={{ __html: safeHtml }}
        />
      ) : (
        <p className="text-sm text-gray-400">
          暂无正文内容，请{' '}
          <a href={article.link} target="_blank" rel="noopener noreferrer" className="text-blue-500">
            查看原文
          </a>
        </p>
      )}
    </div>
  )
}

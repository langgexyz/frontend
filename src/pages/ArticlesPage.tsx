import { useSearchParams } from 'react-router-dom'
import { useArticles } from '../hooks/useArticles'
import ArticleItem from '../components/ArticleItem'

export default function ArticlesPage() {
  const [searchParams] = useSearchParams()
  const feedId = searchParams.get('feed_id')
  const starred = searchParams.get('starred')

  const filter = {
    feed_id: feedId ? Number(feedId) : undefined,
    starred: starred === '1' ? true : undefined,
  }

  const { data, isLoading, isError } = useArticles(filter)

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-400">
        加载中…
      </div>
    )
  }

  if (isError) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-red-400">
        加载失败，请稍后重试
      </div>
    )
  }

  const articles = data?.items ?? []

  if (articles.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-sm text-gray-400">
        {feedId ? '该订阅源暂无文章' : starred ? '暂无收藏文章' : '暂无文章，请先添加订阅源'}
      </div>
    )
  }

  return (
    <div className="divide-y divide-gray-100">
      {articles.map((article) => (
        <ArticleItem key={article.id} article={article} />
      ))}
    </div>
  )
}

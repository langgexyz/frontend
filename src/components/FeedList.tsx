import { useFeeds } from '../hooks/useFeeds'
import FeedItem from './FeedItem'

export default function FeedList() {
  const { data: feeds, isLoading, isError } = useFeeds()

  if (isLoading) {
    return <p className="px-3 py-2 text-xs text-gray-400">加载中…</p>
  }
  if (isError) {
    return <p className="px-3 py-2 text-xs text-red-400">加载失败</p>
  }
  if (!feeds?.length) {
    return <p className="px-3 py-2 text-xs text-gray-400">暂无订阅源</p>
  }

  return (
    <div>
      {feeds.map((feed) => (
        <FeedItem key={feed.id} feed={feed} />
      ))}
    </div>
  )
}

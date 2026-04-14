import { useSearchParams } from 'react-router-dom'
import { useRefreshFeed, useDeleteFeed } from '../hooks/useFeeds'
import type { Feed } from '../api/feeds'

interface Props {
  feed: Feed
}

function formatUpdateTime(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

const STATUS_DOT: Record<Feed['fetch_status'], string> = {
  pending: 'bg-yellow-400',
  fetching: 'bg-blue-400 animate-pulse',
  success: 'bg-green-400',
  failed: 'bg-red-400',
}

export default function FeedItem({ feed }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const isActive = searchParams.get('feed_id') === String(feed.id)
  const refreshFeed = useRefreshFeed()
  const deleteFeed = useDeleteFeed()

  const displayTitle = feed.title || feed.url
  const updateTime = formatUpdateTime(feed.source_updated_at || feed.last_fetched_at)

  const handleSelect = () => {
    setSearchParams({ feed_id: String(feed.id) })
  }

  const handleRefresh = (e: React.MouseEvent) => {
    e.stopPropagation()
    refreshFeed.mutate(feed.id)
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (window.confirm(`确认删除订阅源"${displayTitle}"？`)) {
      deleteFeed.mutate(feed.id, {
        onSuccess: () => {
          if (isActive) setSearchParams({})
        },
      })
    }
  }

  return (
    <div
      className={`group flex items-center gap-1 mx-1 my-0.5 rounded-md px-2 py-1.5 cursor-pointer transition-colors ${
        isActive ? 'bg-blue-50 text-blue-700' : 'text-gray-700 hover:bg-gray-100'
      }`}
      onClick={handleSelect}
    >
      {/* 状态点 */}
      <span
        className={`shrink-0 w-1.5 h-1.5 rounded-full ${STATUS_DOT[feed.fetch_status]}`}
        title={feed.fetch_status}
      />

      {/* 名称 + 时间 */}
      <div className="flex-1 min-w-0">
        <p className="text-sm truncate">{displayTitle}</p>
        {updateTime && (
          <p className="text-xs text-gray-400">{updateTime}</p>
        )}
      </div>

      {/* 操作按钮（hover 显示） */}
      <div className="shrink-0 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={handleRefresh}
          disabled={refreshFeed.isPending || feed.fetch_status === 'fetching'}
          className="p-0.5 text-blue-400 hover:text-blue-600 disabled:opacity-40"
          title="刷新"
        >
          ↺
        </button>
        <button
          onClick={handleDelete}
          disabled={deleteFeed.isPending}
          className="p-0.5 text-red-400 hover:text-red-600 disabled:opacity-40"
          title="删除"
        >
          ✕
        </button>
      </div>
    </div>
  )
}

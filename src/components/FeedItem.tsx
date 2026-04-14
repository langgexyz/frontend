import { NavLink } from 'react-router-dom'
import { Feed } from '../api/feeds'

interface Props {
  feed: Feed
}

function formatUpdateTime(iso: string | null): string {
  if (!iso) return ''
  const d = new Date(iso)
  return d.toLocaleDateString('zh-CN', { month: 'short', day: 'numeric' })
}

export default function FeedItem({ feed }: Props) {
  const displayTitle = feed.title || feed.url
  const statusDot: Record<Feed['fetch_status'], string> = {
    pending: 'bg-yellow-400',
    fetching: 'bg-blue-400 animate-pulse',
    success: 'bg-green-400',
    failed: 'bg-red-400',
  }

  return (
    <NavLink
      to={`/articles?feed_id=${feed.id}`}
      className={({ isActive }) =>
        `flex flex-col px-3 py-2 text-sm rounded-md mx-1 my-0.5 transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-700 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      <div className="flex items-center gap-2">
        <span
          className={`shrink-0 w-1.5 h-1.5 rounded-full ${statusDot[feed.fetch_status]}`}
          title={feed.fetch_status}
        />
        <span className="truncate">{displayTitle}</span>
      </div>
      {(feed.source_updated_at || feed.last_fetched_at) && (
        <span className="text-xs text-gray-400 pl-3.5 truncate">
          {formatUpdateTime(feed.source_updated_at || feed.last_fetched_at)}
        </span>
      )}
    </NavLink>
  )
}

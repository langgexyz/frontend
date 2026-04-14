import { NavLink } from 'react-router-dom'
import { Feed } from '../api/feeds'

interface Props {
  feed: Feed
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
        `flex items-center gap-2 px-3 py-2 text-sm rounded-md mx-1 my-0.5 transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-700 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      <span
        className={`shrink-0 w-1.5 h-1.5 rounded-full ${statusDot[feed.fetch_status]}`}
        title={feed.fetch_status}
      />
      <span className="truncate">{displayTitle}</span>
    </NavLink>
  )
}

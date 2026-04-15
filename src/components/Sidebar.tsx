import { useNavigate, useLocation } from 'react-router-dom'
import AddFeedForm from './AddFeedForm'
import FeedList from './FeedList'

function NavButton({
  label,
  isActive,
  onClick,
}: {
  label: string
  isActive: boolean
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left flex items-center gap-2 px-3 py-2 text-sm rounded-md mx-1 my-0.5 transition-colors ${
        isActive
          ? 'bg-blue-50 text-blue-700 font-medium'
          : 'text-gray-700 hover:bg-gray-100'
      }`}
    >
      {label}
    </button>
  )
}

export default function Sidebar() {
  const navigate = useNavigate()
  const { pathname, search } = useLocation()
  const params = new URLSearchParams(search)
  const feedId = params.get('feed_id')
  const starred = params.get('starred')

  const isOnList = pathname === '/articles'
  const isAllActive = isOnList && !feedId && !starred
  const isStarredActive = isOnList && starred === '1' && !feedId

  return (
    <div className="flex flex-col h-full">
      <AddFeedForm />
      <nav className="flex-1 py-2 overflow-y-auto">
        <div className="mb-1">
          <NavButton
            label="全部文章"
            isActive={isAllActive}
            onClick={() => navigate('/articles')}
          />
          <NavButton
            label="★ 收藏"
            isActive={isStarredActive}
            onClick={() => navigate('/articles?starred=1')}
          />
        </div>
        <div className="mt-3 px-3 mb-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">订阅源</p>
        </div>
        <FeedList />
      </nav>
    </div>
  )
}

import { NavLink } from 'react-router-dom'
import AddFeedForm from './AddFeedForm'
import FeedList from './FeedList'

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-2 px-3 py-2 text-sm rounded-md mx-1 my-0.5 transition-colors ${
          isActive
            ? 'bg-blue-50 text-blue-700 font-medium'
            : 'text-gray-700 hover:bg-gray-100'
        }`
      }
    >
      {label}
    </NavLink>
  )
}

export default function Sidebar() {
  return (
    <div className="flex flex-col h-full">
      <AddFeedForm />
      <nav className="flex-1 py-2 overflow-y-auto">
        <div className="mb-1">
          <NavItem to="/articles" label="全部文章" />
          <NavItem to="/articles?starred=1" label="★ 收藏" />
        </div>
        <div className="mt-3 px-3 mb-1">
          <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">订阅源</p>
        </div>
        <FeedList />
      </nav>
    </div>
  )
}

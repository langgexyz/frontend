import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'

export default function Layout() {
  return (
    <div className="flex h-screen overflow-hidden bg-white">
      <aside className="w-64 shrink-0 border-r border-gray-200 flex flex-col overflow-y-auto bg-gray-50">
        <Sidebar />
      </aside>
      <main className="flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}

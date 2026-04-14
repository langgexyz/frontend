import { useState } from 'react'
import { useAddFeed } from '../hooks/useFeeds'
import { ApiError } from '../api/client'

export default function AddFeedForm() {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')
  const addFeed = useAddFeed()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!url.trim()) return
    setError('')
    addFeed.mutate(url.trim(), {
      onSuccess: () => setUrl(''),
      onError: (err) => {
        if (err instanceof ApiError && err.code === 'FEED_ALREADY_EXISTS') {
          setError('该订阅源已添加')
        } else {
          setError('添加失败，请检查 URL')
        }
      },
    })
  }

  return (
    <form onSubmit={handleSubmit} className="p-3 border-b border-gray-200">
      <div className="flex gap-1.5">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="输入 RSS 地址..."
          className="flex-1 min-w-0 text-sm border border-gray-300 rounded px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
        />
        <button
          type="submit"
          disabled={addFeed.isPending}
          className="shrink-0 text-sm bg-blue-600 text-white px-3 py-1.5 rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {addFeed.isPending ? '…' : '+'}
        </button>
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </form>
  )
}

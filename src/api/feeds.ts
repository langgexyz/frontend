import { client } from './client'

export interface Feed {
  id: number
  url: string
  title: string
  description: string
  fetch_status: 'pending' | 'fetching' | 'success' | 'failed'
  fetch_error: string | null
  source_updated_at: string | null
  last_fetched_at: string | null
  created_at: string
}

export const feedsApi = {
  list: () => client.get<Feed[]>('/feeds').then((r) => r.data),
  create: (url: string) => client.post<Feed>('/feeds', { url }).then((r) => r.data),
  getById: (id: number) => client.get<Feed>(`/feeds/${id}`).then((r) => r.data),
  refresh: (id: number) => client.post(`/feeds/${id}/refresh`).then((r) => r.data),
  delete: (id: number) => client.delete(`/feeds/${id}`).then((r) => r.data),
}

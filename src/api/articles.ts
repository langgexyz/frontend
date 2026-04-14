import { client } from './client'

export interface Article {
  id: number
  feed_id: number
  feed_title: string
  title: string
  link: string
  content: string
  author: string
  published_at: string | null
  is_read: boolean
  is_starred: boolean
  is_full_content: boolean
}

export interface ArticleListResponse {
  total: number
  page: number
  page_size: number
  items: Article[]
}

export interface ArticleFilter {
  feed_id?: number
  starred?: boolean
  unread?: boolean
  page?: number
  page_size?: number
}

export const articlesApi = {
  list: (filter: ArticleFilter = {}) => {
    const params = new URLSearchParams()
    if (filter.feed_id != null) params.set('feed_id', String(filter.feed_id))
    if (filter.starred) params.set('starred', '1')
    if (filter.unread) params.set('unread', '1')
    params.set('page', String(filter.page ?? 1))
    params.set('page_size', String(filter.page_size ?? 20))
    return client.get<ArticleListResponse>(`/articles?${params}`).then((r) => r.data)
  },
  getById: (id: number) => client.get<Article>(`/articles/${id}`).then((r) => r.data),
  update: (id: number, updates: Partial<Pick<Article, 'is_read' | 'is_starred'>>) =>
    client.patch<Article>(`/articles/${id}`, updates).then((r) => r.data),
  fetchFulltext: (id: number) =>
    client.get<Article>(`/articles/${id}/fulltext`).then((r) => r.data),
}

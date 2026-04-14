import { useEffect } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { ArticleFilter } from '../api/articles'
import { articlesApi } from '../api/articles'

export const ARTICLES_KEY = 'articles'

export function useArticles(filter: ArticleFilter = {}) {
  return useQuery({
    queryKey: [ARTICLES_KEY, filter],
    queryFn: () => articlesApi.list(filter),
  })
}

export function useArticle(id: number) {
  const qc = useQueryClient()
  const result = useQuery({
    queryKey: [ARTICLES_KEY, id],
    queryFn: () => articlesApi.getById(id),
  })

  // 读取详情后使列表缓存过期（因为已读状态改变）
  useEffect(() => {
    if (result.data) {
      qc.invalidateQueries({ queryKey: [ARTICLES_KEY] })
    }
  }, [result.data, qc])

  return result
}

export function useUpdateArticle() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, updates }: { id: number; updates: Parameters<typeof articlesApi.update>[1] }) =>
      articlesApi.update(id, updates),
    onSuccess: () => qc.invalidateQueries({ queryKey: [ARTICLES_KEY] }),
  })
}

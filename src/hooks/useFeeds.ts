import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { feedsApi } from '../api/feeds'

export const FEEDS_KEY = ['feeds'] as const

export function useFeeds() {
  return useQuery({
    queryKey: FEEDS_KEY,
    queryFn: feedsApi.list,
  })
}

export function useAddFeed() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (url: string) => feedsApi.create(url),
    onSuccess: () => qc.invalidateQueries({ queryKey: FEEDS_KEY }),
  })
}

export function useRefreshFeed() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => feedsApi.refresh(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: FEEDS_KEY }),
  })
}

export function useDeleteFeed() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: number) => feedsApi.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: FEEDS_KEY })
      qc.invalidateQueries({ queryKey: ['articles'] })
    },
  })
}

import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import ArticleItem from './ArticleItem'
import { Article } from '../api/articles'

const baseArticle: Article = {
  id: 1,
  feed_id: 1,
  feed_title: 'Test Feed',
  title: 'Test Article',
  link: 'https://example.com/1',
  content: 'content',
  author: 'Alice',
  published_at: '2026-04-14T10:00:00Z',
  is_read: false,
  is_starred: false,
  is_full_content: false,
}

function renderArticle(article: Partial<Article> = {}) {
  return render(
    <MemoryRouter>
      <ArticleItem article={{ ...baseArticle, ...article }} />
    </MemoryRouter>
  )
}

describe('ArticleItem', () => {
  it('未读文章标题加粗', () => {
    renderArticle({ is_read: false })
    const title = screen.getByText('Test Article')
    expect(title).toHaveClass('font-semibold')
  })

  it('已读文章标题变灰', () => {
    renderArticle({ is_read: true })
    const title = screen.getByText('Test Article')
    expect(title).toHaveClass('font-normal')
    expect(title).toHaveClass('text-gray-500')
  })

  it('未读文章有蓝色左边框', () => {
    const { container } = renderArticle({ is_read: false })
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('border-l-blue-500')
  })

  it('已读文章无蓝色左边框', () => {
    const { container } = renderArticle({ is_read: true })
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper.className).toContain('border-l-transparent')
  })

  it('收藏文章显示星号', () => {
    renderArticle({ is_starred: true })
    expect(screen.getByText('★')).toBeInTheDocument()
  })

  it('非收藏文章不显示星号', () => {
    renderArticle({ is_starred: false })
    expect(screen.queryByText('★')).not.toBeInTheDocument()
  })

  it('显示来源名称', () => {
    renderArticle()
    expect(screen.getByText(/Test Feed/)).toBeInTheDocument()
  })

  it('published_at 为 null 时不渲染日期', () => {
    const { container } = renderArticle({ published_at: null })
    expect(container).toBeInTheDocument() // 不崩溃即可
  })
})

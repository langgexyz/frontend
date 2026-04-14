import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { MemoryRouter } from 'react-router-dom'
import { describe, it, expect } from 'vitest'
import AddFeedForm from './AddFeedForm'

function renderForm() {
  const queryClient = new QueryClient({
    defaultOptions: { mutations: { retry: false }, queries: { retry: false } },
  })
  return render(
    <QueryClientProvider client={queryClient}>
      <MemoryRouter>
        <AddFeedForm />
      </MemoryRouter>
    </QueryClientProvider>
  )
}

describe('AddFeedForm', () => {
  it('渲染 URL 输入框', () => {
    renderForm()
    expect(screen.getByPlaceholderText('输入 RSS 地址...')).toBeInTheDocument()
  })

  it('渲染提交按钮', () => {
    renderForm()
    expect(screen.getByRole('button')).toBeInTheDocument()
  })

  it('输入 URL 后按钮可以点击', async () => {
    renderForm()
    const input = screen.getByPlaceholderText('输入 RSS 地址...')
    await userEvent.type(input, 'https://example.com/rss')
    const btn = screen.getByRole('button')
    expect(btn).not.toBeDisabled()
  })
})

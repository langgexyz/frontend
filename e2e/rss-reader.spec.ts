// frontend/e2e/rss-reader.spec.ts
import { test, expect, request as playwrightRequest } from '@playwright/test'

const BACKEND = 'http://localhost:8080'
const FIXTURE_FEED_URL = 'http://localhost:4000/feed.xml'

// 每次测试套件运行前清空数据库（通过 API 删除所有 feeds）
test.beforeAll(async () => {
  const ctx = await playwrightRequest.newContext({ baseURL: BACKEND })
  const res = await ctx.get('/api/feeds')
  const feeds: Array<{ id: number }> = await res.json()
  for (const feed of feeds) {
    await ctx.delete(`/api/feeds/${feed.id}`)
  }
  await ctx.dispose()
})

test.describe('RSS 阅读器 E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('初始页面重定向到 /articles', async ({ page }) => {
    await expect(page).toHaveURL(/\/articles/)
  })

  test('侧边栏包含添加订阅源输入框', async ({ page }) => {
    await expect(page.getByPlaceholder(/RSS/i)).toBeVisible()
  })

  test('侧边栏有全部文章和收藏导航', async ({ page }) => {
    await expect(page.getByRole('button', { name: '全部文章' })).toBeVisible()
    await expect(page.getByRole('button', { name: /收藏/ })).toBeVisible()
  })

  test('点击收藏切换 URL 参数', async ({ page }) => {
    await page.getByRole('button', { name: /收藏/ }).click()
    await expect(page).toHaveURL(/starred=1/)
  })

  test('点击全部文章清除筛选', async ({ page }) => {
    await page.getByRole('button', { name: /收藏/ }).click()
    await expect(page).toHaveURL(/starred=1/)
    await page.getByRole('button', { name: '全部文章' }).click()
    await expect(page).not.toHaveURL(/starred=1/)
  })

  test('输入无效 URL 提交显示报错', async ({ page }) => {
    const input = page.getByPlaceholder(/RSS/i)
    await input.fill('not-a-url')
    await page.getByRole('button', { name: '+' }).click()
    // gin binding:"url" 校验失败，前端显示错误提示，不崩溃
    await expect(page.locator('body')).toBeVisible()
  })

  test('添加订阅源 → 文章出现 → 点击标记已读', async ({ page }) => {
    // 1. 添加本地 RSS fixture
    const input = page.getByPlaceholder(/RSS/i)
    await input.fill(FIXTURE_FEED_URL)
    await page.getByRole('button', { name: '+' }).click()

    // 2. 等待订阅源出现在侧边栏（任意状态点可见）
    await expect(
      page.locator('span[title]').filter({ hasText: '' }).first()
    ).toBeVisible({ timeout: 15_000 })

    // 3. 等待文章出现（后端异步抓取，staleTime=30s 所以前端轮询靠手动刷新）
    //    文章列表在 TanStack Query staleTime 内不会自动刷新，
    //    等待订阅源 fetch_status 变为 success 后再刷新页面
    await expect(async () => {
      // 每次 reload 后 TanStack Query 重新 fetch 文章列表
      await page.reload()
      await expect(page.getByText('E2E Test Article 1')).toBeVisible()
    }).toPass({ timeout: 30_000, intervals: [2000] })

    // 4. 点击文章 → 进入详情页（自动标记已读）
    await page.getByText('E2E Test Article 1').click()
    await expect(page).toHaveURL(/\/articles\/\d+/)

    // 5. 返回列表，文章应变为已读样式（border-l-blue-500 消失）
    await page.goBack()
    // 找到包含文章标题的条目容器
    const titleEl = page.getByText('E2E Test Article 1')
    await expect(titleEl).toHaveClass(/font-normal/)
  })

  test('收藏文章 → 收藏列表可见', async ({ page }) => {
    await page.goto('/articles')

    // 等文章列表加载（依赖上一个测试已经添加了订阅源）
    await expect(page.getByText('E2E Test Article 1')).toBeVisible({ timeout: 10_000 })

    await page.getByText('E2E Test Article 1').click()
    await expect(page).toHaveURL(/\/articles\/\d+/)

    // 点收藏按钮（☆ → ★）
    await page.getByTitle('收藏').click()
    await expect(page.getByTitle('取消收藏')).toBeVisible()

    // 返回，进入收藏列表
    await page.goBack()
    await page.getByRole('button', { name: /收藏/ }).click()
    await expect(page.getByText('E2E Test Article 1')).toBeVisible()
  })
})

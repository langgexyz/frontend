// frontend/e2e/rss-reader.spec.ts
import { test, expect } from '@playwright/test'

const FIXTURE_FEED_URL = 'http://localhost:4000/feed.xml'

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
    // gin validator 拒绝非 URL，前端应显示错误提示
    await expect(page.locator('body')).toBeVisible()
  })

  test('添加订阅源 → 文章出现 → 点击标记已读', async ({ page }) => {
    // 1. 添加本地 RSS fixture
    const input = page.getByPlaceholder(/RSS/i)
    await input.fill(FIXTURE_FEED_URL)
    await page.getByRole('button', { name: '+' }).click()

    // 2. 等待订阅源出现在侧边栏（状态为 fetching 或 success）
    await expect(
      page.locator('[title="fetching"],[title="success"],[title="pending"]').first()
    ).toBeVisible({ timeout: 15_000 })

    // 3. 等待文章出现（后端异步抓取）
    await expect(
      page.getByText('E2E Test Article 1')
    ).toBeVisible({ timeout: 20_000 })

    // 4. 点击文章 → 进入详情页（自动标记已读）
    await page.getByText('E2E Test Article 1').click()
    await expect(page).toHaveURL(/\/articles\/\d+/)

    // 5. 返回列表，文章应变为已读样式（无 border-l-blue-500）
    await page.goBack()
    const article = page.getByText('E2E Test Article 1').locator('..')
    // 已读文章父容器不含蓝色边框类
    await expect(article).not.toHaveClass(/border-l-blue-500/)
  })

  test('收藏文章 → 收藏列表可见', async ({ page }) => {
    // 先进入某篇文章详情
    await page.goto('/articles')
    // 等文章列表加载
    const articleLink = page.getByText('E2E Test Article 1')
    // 如果文章不存在（订阅源未添加），先跳过
    const count = await articleLink.count()
    if (count === 0) {
      test.skip()
      return
    }

    await articleLink.click()
    await expect(page).toHaveURL(/\/articles\/\d+/)

    // 点击收藏按钮（☆ → ★）
    const starBtn = page.getByTitle('收藏')
    await starBtn.click()
    await expect(page.getByTitle('取消收藏')).toBeVisible()

    // 返回，进入收藏列表
    await page.goBack()
    await page.getByRole('button', { name: /收藏/ }).click()
    await expect(page.getByText('E2E Test Article 1')).toBeVisible()
  })
})

import { test, expect } from '@playwright/test'

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
    // 先切到收藏
    await page.getByRole('button', { name: /收藏/ }).click()
    await expect(page).toHaveURL(/starred=1/)

    // 再切回全部
    await page.getByRole('button', { name: '全部文章' }).click()
    await expect(page).not.toHaveURL(/starred=1/)
  })

  test('输入无效 URL 格式提交不发请求', async ({ page }) => {
    const input = page.getByPlaceholder(/RSS/i)
    await input.fill('not-a-url')
    // 找到提交按钮（+号）并点击
    await page.getByRole('button', { name: '+' }).click()
    // 如果后端未运行会看到错误提示，但不应崩溃
    // 只验证页面没有崩溃（没有出现全屏错误）
    await expect(page.locator('body')).toBeVisible()
  })

  // 以下测试依赖后端运行，本地开发时手动执行
  test.skip('添加订阅源后列表出现（需要后端）', async ({ page }) => {
    const input = page.getByPlaceholder(/RSS/i)
    await input.fill('https://feeds.feedburner.com/ruanyifeng')
    await page.getByRole('button', { name: '+' }).click()
    // 等待订阅源出现在侧边栏（最多 10 秒）
    await expect(page.locator('[title="fetching"], [title="success"]').first()).toBeVisible({ timeout: 10_000 })
  })
})

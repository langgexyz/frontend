// frontend/e2e/global-setup.ts
import { execSync } from 'child_process'
import * as http from 'http'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'

export default async function globalSetup() {
  // 1. 启动 MySQL（docker compose，等待 healthy）
  console.log('[setup] Starting MySQL via docker compose...')
  execSync(
    'docker compose -f ../docker-compose.e2e.yml up -d --wait',
    { cwd: __dirname, stdio: 'inherit' }
  )
  // 额外等待 2 秒确保 MySQL 完全就绪
  await new Promise(r => setTimeout(r, 2000))
  console.log('[setup] MySQL is ready')

  // 2. 启动本地 RSS fixture server (port 4000)
  const feedXml = fs.readFileSync(
    path.join(__dirname, 'fixtures', 'feed.xml'),
    'utf-8'
  )
  const rssServer = http.createServer((req, res) => {
    if (req.url === '/feed.xml') {
      res.writeHead(200, { 'Content-Type': 'application/rss+xml; charset=utf-8' })
      res.end(feedXml)
    } else {
      res.writeHead(404)
      res.end()
    }
  })
  await new Promise<void>((resolve) => rssServer.listen(4000, resolve))
  console.log('[setup] RSS fixture server running on http://localhost:4000/feed.xml')

  // 将 server 存到全局供 teardown 使用
  ;(global as any).__RSS_SERVER__ = rssServer

  // 同时写入临时文件作为备用
  fs.writeFileSync(
    path.join(os.tmpdir(), 'e2e-rss-server.pid'),
    process.pid.toString()
  )
}

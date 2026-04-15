// frontend/e2e/global-setup.ts
import { execSync } from 'child_process'
import * as http from 'http'
import * as net from 'net'
import * as fs from 'fs'
import * as path from 'path'
import * as os from 'os'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** Returns true if something is already listening on the given port */
function isPortOpen(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const socket = net.createConnection(port, '127.0.0.1')
    socket.once('connect', () => { socket.destroy(); resolve(true) })
    socket.once('error', () => { socket.destroy(); resolve(false) })
    socket.setTimeout(1000, () => { socket.destroy(); resolve(false) })
  })
}

export default async function globalSetup() {
  // 1. 启动 MySQL（如果 3306 已经有服务则跳过 Docker）
  const mysqlAlreadyUp = await isPortOpen(3306)
  if (mysqlAlreadyUp) {
    console.log('[setup] MySQL already listening on 3306, skipping docker compose')
    ;(global as any).__MYSQL_DOCKER__ = false
  } else {
    console.log('[setup] Starting MySQL via docker compose...')
    execSync(
      'docker compose -f ../docker-compose.e2e.yml up -d --wait',
      { cwd: __dirname, stdio: 'inherit' }
    )
    // 额外等待 2 秒确保 MySQL 完全就绪
    await new Promise(r => setTimeout(r, 2000))
    console.log('[setup] MySQL is ready')
    ;(global as any).__MYSQL_DOCKER__ = true
  }

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

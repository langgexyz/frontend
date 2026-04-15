// frontend/e2e/global-teardown.ts
import { execSync } from 'child_process'
import * as http from 'http'
import * as path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

export default async function globalTeardown() {
  // 停止 RSS fixture server
  const rssServer: http.Server | undefined = (global as any).__RSS_SERVER__
  if (rssServer) {
    await new Promise<void>((resolve) => rssServer.close(resolve))
    console.log('[teardown] RSS fixture server stopped')
  } else {
    // 备选方案：通过端口 kill
    try {
      execSync("lsof -ti:4000 | xargs kill -9 2>/dev/null || true", { stdio: 'inherit' })
    } catch {
      // ignore
    }
  }

  // 停止 MySQL（仅当我们通过 Docker 启动时）
  const mysqlDocker: boolean = (global as any).__MYSQL_DOCKER__
  if (mysqlDocker) {
    console.log('[teardown] Stopping MySQL docker container...')
    execSync(
      'docker compose -f ../docker-compose.e2e.yml down',
      { cwd: __dirname, stdio: 'inherit' }
    )
    console.log('[teardown] MySQL stopped')
  } else {
    console.log('[teardown] MySQL was pre-existing, skipping docker compose down')
  }
}

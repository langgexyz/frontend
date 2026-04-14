// frontend/e2e/global-teardown.ts
import { execSync } from 'child_process'
import * as http from 'http'

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

  // 停止 MySQL
  console.log('[teardown] Stopping MySQL...')
  execSync(
    'docker compose -f ../docker-compose.e2e.yml down',
    { cwd: __dirname, stdio: 'inherit' }
  )
  console.log('[teardown] MySQL stopped')
}

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // The CMS backend the dev/preview servers forward /api and /uploads to, so
  // the browser talks to a single origin (no CORS, no hardcoded API host).
  const target = env.VITE_DEV_API_TARGET || 'http://localhost:4200'
  // Through the proxy every call is same-origin for the browser, so the Origin
  // header is dropped; the backend's CORS allow-list applies to real
  // cross-origin deployments only.
  const forward = {
    target,
    changeOrigin: true,
    configure: proxy => proxy.on('proxyReq', req => req.removeHeader('origin')),
  }
  const proxy = { '/api': forward, '/uploads': forward }

  return {
    plugins: [react()],
    server: { port: 5173, open: true, proxy },
    preview: { port: 4173, proxy },
  }
})

import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')

  const isDev = mode === 'development'
  const apiTarget = isDev
    ? 'http://localhost:3000'
    : (env.VITE_API_URL?.startsWith('http') ? env.VITE_API_URL : 'https://file-upload-api-1bvr.onrender.com')

  return {
    build: {
      chunkSizeWarningLimit: 1000,
    },
    plugins: [
      react(),
      tailwindcss()
    ],
    server: {
      watch: {
        usePolling: true,
      },
      host: true,
      proxy: {
        '/api': {
          target: apiTarget,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        }
      }
    },
  }
})
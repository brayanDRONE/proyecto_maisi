import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:8000',
        changeOrigin: true,
      },
      '/tworld-img': {
        target: 'https://tworldstore.cl',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/tworld-img/, ''),
        headers: {
          Referer: 'https://tworldstore.cl/',
          Origin: 'https://tworldstore.cl',
        },
      },
    }
  },
  build: {
    outDir: 'dist',
  }
})

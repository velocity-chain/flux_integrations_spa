import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    port: 8400,
    proxy: {
      '/api': {
        target: 'http://localhost:8399',
        changeOrigin: true
      },
      '/dev-login': {
        target: 'http://localhost:8399',
        changeOrigin: true
      }
    }
  }
})

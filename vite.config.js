import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
   server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080', // 目标是你的 JSON Server
        changeOrigin: true,
        // 核心：这行代码确保将 /api/rooms 变成 /rooms
        rewrite: path => path.replace(/^\/api/, '') 
      }
    }
  }
})

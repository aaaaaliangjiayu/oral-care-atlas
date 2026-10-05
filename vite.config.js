import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// base: './' 让构建产物可以用相对路径打开/部署到任意子目录（QW Pages 友好）
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: './',
})

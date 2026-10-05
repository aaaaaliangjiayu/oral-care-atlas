import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'vite'

// base 设为仓库子路径 /oral-care-atlas/，适配 GitHub Pages；
// 本地 npm run dev / build 同样可用。
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: '/oral-care-atlas/',
})

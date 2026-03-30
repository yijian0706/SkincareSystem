import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  // 必须和 GitHub 的仓库名完全一致，注意前后的斜杠
  base: '/SkincareSystem/', 
})
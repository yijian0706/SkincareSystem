import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite' // 确保这一行存在

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(), // 确保这一行也存在
  ],
  base: '/SkincareSystem/', // 必须和你的仓库名一致
})
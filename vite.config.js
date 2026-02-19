import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // QUAN TRỌNG: Tên repo của bạn là VPH-01 nên base phải như dưới đây
  base: '/VPH-01/', 
})

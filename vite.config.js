import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Tên Repo của bạn là VPH-01, nên base path chuẩn xác nhất cho GitHub Pages là '/VPH-01/'
  base: '/VPH-01/', 
})

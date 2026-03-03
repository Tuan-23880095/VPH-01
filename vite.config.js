import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Thay đổi './' thành tên repository của bạn trên GitHub
  base: '/VPH-01/', 
})

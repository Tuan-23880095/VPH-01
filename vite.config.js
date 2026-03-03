import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Sửa lại thành đúng tên Repo của bạn, phân biệt chữ Hoa/Thường
  base: '/VPH-01/', 
})

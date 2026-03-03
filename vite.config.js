import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Thay đổi dòng này thành './' để GitHub tự động nhận diện đúng thư mục (chống lỗi trắng trang)
  base: './', 
})

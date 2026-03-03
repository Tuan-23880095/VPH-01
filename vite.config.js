import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // SỬA TẠI ĐÂY: Dùng './' thay vì '/VPH-01/' để web tự động nhận diện đúng thư mục
  base: './', 
})

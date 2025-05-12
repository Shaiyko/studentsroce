// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'build', // สำคัญ
  },
  base: '/', // ถ้า deploy root ให้ใส่ / หรือใส่ /ชื่อ-project ถ้าใช้ GitHub Pages
});

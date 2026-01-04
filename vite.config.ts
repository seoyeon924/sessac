import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  define: {
    // 브라우저 환경에서 process.env 참조 시 에러가 나지 않도록 빈 객체로 정의하거나 
    // 실제 환경 변수를 주입합니다.
    'process.env': {
      API_KEY: JSON.stringify(process.env.API_KEY || '')
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false
  }
});

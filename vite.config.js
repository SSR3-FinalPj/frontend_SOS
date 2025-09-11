import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  // .env 파일 로드
  const env = loadEnv(mode, process.cwd(), '')

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': '/src'
      },
      extensions: ['.js', '.jsx', '.ts', '.tsx', '.json']
    },
    server: {
      proxy: {
        '/api': {
          target: env.VITE_API_URL, // ✅ 여기서 .env 값을 가져옴
          changeOrigin: true,
          secure: false,
        }
      }
    }
  }
})

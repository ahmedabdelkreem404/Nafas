import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      'lucide-react': fileURLToPath(new URL('./src/vendor/lucide-react.tsx', import.meta.url)),
    },
  },
  plugins: [react()],
})

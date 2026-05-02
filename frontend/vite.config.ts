import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rolldownOptions: {
      output: {
        codeSplitting: {
          groups: [
            { name: 'react', test: /node_modules[\\/](react|react-dom|react-router-dom)[\\/]/ },
            { name: 'motion', test: /node_modules[\\/](framer-motion|gsap)[\\/]/ },
            { name: 'three', test: /node_modules[\\/](three|@react-three)[\\/]/ },
          ],
        },
      },
    },
  },
})
